from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from university.models import Student, Lecturer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'index_number', 'academic_title', 'password']
        read_only_fields = ['id']

    def _ensure_profile(self, user):
        if user.role == 'student' and not hasattr(user, 'student_profile'):
            Student.objects.get_or_create(user=user, defaults={'semester': 1, 'year': 1})
        elif user.role == 'lecturer' and not hasattr(user, 'lecturer_profile'):
            Lecturer.objects.get_or_create(user=user)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        self._ensure_profile(user)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        old_role = instance.role
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        if user.role != old_role:
            self._ensure_profile(user)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get('email')
        password = attrs.get('password')

        if not identifier:
            raise serializers.ValidationError("Email lub nazwa użytkownika jest wymagana")

        if not password:
            raise serializers.ValidationError("Hasło jest wymagane")

        try:
            if '@' in identifier:
                user = User.objects.get(email=identifier)
            else:
                user = User.objects.get(username=identifier)
        except User.DoesNotExist:
            raise serializers.ValidationError("Nieprawidłowy email lub nazwa użytkownika")

        user = authenticate(username=user.username, password=password)
        if user is None:
            raise serializers.ValidationError("Nieprawidłowe hasło")

        if not user.is_active:
            raise serializers.ValidationError("Konto jest nieaktywne")

        attrs['user'] = user
        return attrs


class DemoLoginSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['student', 'lecturer', 'admin'])
