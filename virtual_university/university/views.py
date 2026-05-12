from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

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
)


# CRUD dla kierunków
class FieldOfStudyViewSet(viewsets.ModelViewSet):

    queryset = FieldOfStudy.objects.all()
    serializer_class = FieldOfStudySerializer

    permission_classes = [IsAuthenticated]


# CRUD dla przedmiotów
class SubjectViewSet(viewsets.ModelViewSet):

    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    permission_classes = [IsAuthenticated]


# CRUD dla studentów
class StudentViewSet(viewsets.ModelViewSet):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    permission_classes = [IsAuthenticated]


# CRUD dla wykładowców
class LecturerViewSet(viewsets.ModelViewSet):

    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer

    permission_classes = [IsAuthenticated]


# Zarządzanie harmonogramem zajęć
class ClassScheduleViewSet(viewsets.ModelViewSet):

    queryset = ClassSchedule.objects.all()
    serializer_class = ClassScheduleSerializer

    permission_classes = [IsAuthenticated]


# Zarządzanie ocenami
class GradeViewSet(viewsets.ModelViewSet):

    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

    permission_classes = [IsAuthenticated]

    # Automatyczne przypisanie wykładowcy do oceny
    def perform_create(self, serializer):

        lecturer = self.request.user.lecturer_profile

        serializer.save(lecturer=lecturer)