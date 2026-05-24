from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied

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


class FieldOfStudyViewSet(viewsets.ModelViewSet):
    queryset = FieldOfStudy.objects.all()
    serializer_class = FieldOfStudySerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


class SubjectViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Subject.objects.all()
        if user.role == 'lecturer':
            return Subject.objects.filter(lecturers__user=user)
        if user.role == 'student':
            return Subject.objects.filter(
                field_of_study__students__user=user
            ).distinct()
        return Subject.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Student.objects.all()
        if user.role == 'lecturer':
            return Student.objects.all()
        if user.role == 'student':
            return Student.objects.filter(user=user)
        return Student.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


class LecturerViewSet(viewsets.ModelViewSet):
    serializer_class = LecturerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Lecturer.objects.all()
        if user.role == 'lecturer':
            return Lecturer.objects.filter(user=user)
        if user.role == 'student':
            return Lecturer.objects.all()
        return Lecturer.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


class ClassScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ClassScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return ClassSchedule.objects.all()
        if user.role == 'lecturer':
            return ClassSchedule.objects.filter(lecturer__user=user)
        if user.role == 'student':
            return ClassSchedule.objects.filter(
                subject__field_of_study__students__user=user
            ).distinct()
        return ClassSchedule.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]


class GradeViewSet(viewsets.ModelViewSet):
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Grade.objects.all()
        if user.role == 'lecturer':
            return Grade.objects.filter(subject__lecturers__user=user)
        if user.role == 'student':
            return Grade.objects.filter(student__user=user)
        return Grade.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsLecturer()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'lecturer':
            raise PermissionDenied("Tylko wykładowcy mogą wystawiać oceny")
        try:
            lecturer = user.lecturer_profile
        except Lecturer.DoesNotExist:
            raise ValidationError("Użytkownik nie ma profilu wykładowcy")
        subject = serializer.validated_data.get('subject')
        if subject and not lecturer.subjects.filter(id=subject.id).exists():
            raise PermissionDenied(
                "Nie możesz wystawić oceny z przedmiotu, którego nie prowadzisz"
            )
        serializer.save(lecturer=lecturer)

    def perform_update(self, serializer):
        user = self.request.user
        if user.role != 'lecturer':
            raise PermissionDenied("Tylko wykładowcy mogą modyfikować oceny")
        try:
            lecturer = user.lecturer_profile
        except Lecturer.DoesNotExist:
            raise ValidationError("Użytkownik nie ma profilu wykładowcy")
        grade = self.get_object()
        if not lecturer.subjects.filter(id=grade.subject.id).exists():
            raise PermissionDenied(
                "Nie możesz modyfikować oceny z przedmiotu, którego nie prowadzisz"
            )
        serializer.save(lecturer=lecturer)
