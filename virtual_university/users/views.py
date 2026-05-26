from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import User
from .serializers import UserSerializer, LoginSerializer, DemoLoginSerializer
from university.permissions import IsAdministrator
from university.models import Student, Lecturer, FieldOfStudy


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role,
                'indexNumber': user.index_number,
                'academicTitle': user.academic_title,
            }
        }, status=status.HTTP_200_OK)

    errors = serializer.errors
    if 'non_field_errors' in errors:
        error_msg = errors['non_field_errors'][0]
    elif 'email' in errors:
        error_msg = errors['email'][0]
    elif 'password' in errors:
        error_msg = errors['password'][0]
    else:
        error_msg = 'Nieprawidłowe dane logowania'
    return Response({'detail': error_msg}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def demo_login_view(request):
    serializer = DemoLoginSerializer(data=request.data)
    if serializer.is_valid():
        role = serializer.validated_data['role']

        demo_users = {
            'student': {
                'username': 'student_demo',
                'email': 'student@demo.com',
                'first_name': 'Jan',
                'last_name': 'Nowak',
                'role': 'student',
                'index_number': '123456',
            },
            'lecturer': {
                'username': 'lecturer_demo',
                'email': 'lecturer@demo.com',
                'first_name': 'Maria',
                'last_name': 'Kowalski',
                'role': 'lecturer',
                'academic_title': 'Dr',
            },
            'admin': {
                'username': 'admin_demo',
                'email': 'admin@demo.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
            },
        }

        user_data = demo_users[role]

        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'role': user_data['role'],
                'index_number': user_data.get('index_number', ''),
                'academic_title': user_data.get('academic_title', ''),
            }
        )

        if created:
            user.set_password('demo123')
            user.save()

        token, _ = Token.objects.get_or_create(user=user)

        if role == 'student':
            Student.objects.get_or_create(
                user=user,
                defaults={
                    'semester': 1,
                    'year': 1,
                    'field_of_study': FieldOfStudy.objects.first(),
                }
            )
        elif role == 'lecturer':
            Lecturer.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role,
                'indexNumber': user.index_number,
                'academicTitle': user.academic_title,
            }
        }, status=status.HTTP_200_OK)

    errors = serializer.errors
    if 'non_field_errors' in errors:
        error_msg = errors['non_field_errors'][0]
    elif 'role' in errors:
        error_msg = errors['role'][0]
    else:
        error_msg = 'Nieprawidłowe dane logowania demo'
    return Response({'detail': error_msg}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Pobranie profilu aktualnie zalogowanego użytkownika.
    Wymaga tokena autoryzacji.
    """
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'role': user.role,
        'indexNumber': user.index_number,
        'academicTitle': user.academic_title,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Wylogowanie użytkownika - usunięcie tokena.
    """
    try:
        # Usunięcie tokena użytkownika
        request.user.auth_token.delete()
    except Token.DoesNotExist:
        # Token nie istnieje - ignoruj
        pass
    except Exception:
        # Inny błąd - ignoruj
        pass
    
    return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdministrator]
