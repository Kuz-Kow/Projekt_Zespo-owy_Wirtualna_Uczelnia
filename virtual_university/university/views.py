from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404

from .models import (
    FieldOfStudy,
    Subject,
    Student,
    Lecturer,
    ClassSchedule,
    Grade
)

from .serializers import (
    FieldOfStudySerializer,
    SubjectSerializer,
    StudentSerializer,
    LecturerSerializer,
    ClassScheduleSerializer,
    GradeSerializer
)

from .permissions import (
    IsAdministrator,
    IsLecturer,
    IsStudent
)


# CRUD dla kierunków - tylko administrator może tworzyć/modyfikować
class FieldOfStudyViewSet(viewsets.ModelViewSet):
    queryset = FieldOfStudy.objects.all()
    serializer_class = FieldOfStudySerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Uprawnienia na podstawie akcji"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


# CRUD dla przedmiotów
class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Uprawnienia na podstawie akcji"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


# CRUD dla studentów
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Uprawnienia na podstawie akcji"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


# CRUD dla wykładowców
class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Uprawnienia na podstawie akcji"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


# Zarządzanie harmonogramem zajęć
class ClassScheduleViewSet(viewsets.ModelViewSet):
    queryset = ClassSchedule.objects.all()
    serializer_class = ClassScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Uprawnienia na podstawie akcji"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


# Zarządzanie ocenami - tylko wykładowcy mogą tworzyć oceny
class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Uprawnienia na podstawie akcji"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsLecturer()]
        return [IsAuthenticated()]

    # Automatyczne przypisanie wykładowcy do oceny
    def perform_create(self, serializer):
        """
        Automatyczne przypisanie wykładowcy do oceny.
        Sprawdza czy użytkownik ma profil wykładowcy.
        """
        user = self.request.user
        
        # Sprawdzenie czy użytkownik jest wykładowcą
        if user.role != 'lecturer':
            raise ValidationError("Tylko wykładowcy mogą wystawiać oceny")
        
        # Próba pobrania profilu wykładowcy
        try:
            lecturer = user.lecturer_profile
        except Lecturer.DoesNotExist:
            raise ValidationError("Użytkownik nie ma profilu wykładowcy")
        
        # Zapisanie oceny z przypisanym wykładowcą
        serializer.save(lecturer=lecturer)

    def perform_update(self, serializer):
        """
        Automatyczne przypisanie wykładowcy przy aktualizacji oceny.
        """
        user = self.request.user
        
        if user.role != 'lecturer':
            raise ValidationError("Tylko wykładowcy mogą modyfikować oceny")
        
        try:
            lecturer = user.lecturer_profile
        except Lecturer.DoesNotExist:
            raise ValidationError("Użytkownik nie ma profilu wykładowcy")
        
        serializer.save(lecturer=lecturer)
