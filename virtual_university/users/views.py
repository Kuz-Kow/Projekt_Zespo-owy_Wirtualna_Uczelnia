from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login

from .models import User
from .serializers import UserSerializer, LoginSerializer, DemoLoginSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """User login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        user_data = UserSerializer(user).data
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
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def demo_login_view(request):
    """Demo login for testing"""
    serializer = DemoLoginSerializer(data=request.data)
    if serializer.is_valid():
        role = serializer.validated_data['role']
        
        # Create or get demo user based on role
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
                'academic_title': 'Dr.',
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
        
        # Set a default password if new user
        if created:
            user.set_password('demo123')
            user.save()
        
        # Create or get token
        token, _ = Token.objects.get_or_create(user=user)
        
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
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """Get current user profile"""
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
    """User logout endpoint"""
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
