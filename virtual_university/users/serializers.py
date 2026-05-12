from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'index_number', 'academic_title']
        read_only_fields = ['id']


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
