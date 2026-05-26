from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    FieldOfStudy,
    Subject,
    Student,
    Lecturer,
    ClassSchedule,
    Grade,
    CourseMaterial
)

from .serializers import (
    FieldOfStudySerializer,
    SubjectSerializer,
    StudentSerializer,
    LecturerSerializer,
    ClassScheduleSerializer,
    GradeSerializer,
    CourseMaterialSerializer
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

    @action(detail=False, methods=['get'])
    def my_students(self, request):
        user = request.user
        if user.role != 'lecturer':
            return Response([])
        try:
            lecturer = user.lecturer_profile
        except Lecturer.DoesNotExist:
            return Response([])
        lecturer_subjects = lecturer.subjects.all()
        subject_fields = lecturer_subjects.values_list('field_of_study', flat=True).distinct()
        subject_semesters = lecturer_subjects.values_list('semester', flat=True).distinct()
        students_by_m2m = Student.objects.filter(subjects__in=lecturer_subjects)
        students_by_field_sem = Student.objects.filter(
            field_of_study__in=subject_fields,
            semester__in=subject_semesters,
        )
        students = (students_by_m2m | students_by_field_sem).distinct()
        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data)


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
        if self.request.query_params.get('mode') == 'admin':
            return ClassSchedule.objects.all()
        if user.role == 'admin':
            return ClassSchedule.objects.none()
        if user.role == 'lecturer':
            return ClassSchedule.objects.filter(lecturer__user=user)
        if user.role == 'student':
            try:
                student = Student.objects.get(user=user)
            except Student.DoesNotExist:
                return ClassSchedule.objects.none()
            return ClassSchedule.objects.filter(
                subject__field_of_study__students__user=user,
                subject__semester=student.semester
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
            return Grade.objects.none()
        if user.role == 'lecturer':
            return Grade.objects.filter(lecturer__user=user)
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


class CourseMaterialViewSet(viewsets.ModelViewSet):
    serializer_class = CourseMaterialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return CourseMaterial.objects.all()
        if user.role == 'lecturer':
            return CourseMaterial.objects.filter(
                subject__lecturers__user=user
            ).distinct()
        if user.role == 'student':
            return CourseMaterial.objects.filter(
                subject__field_of_study__students__user=user
            ).distinct()
        return CourseMaterial.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if self.request.user.role == 'lecturer':
                return [IsAuthenticated()]
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'lecturer':
            try:
                lecturer = user.lecturer_profile
            except Lecturer.DoesNotExist:
                raise ValidationError("Użytkownik nie ma profilu wykładowcy")
            subject = serializer.validated_data.get('subject')
            if subject and not lecturer.subjects.filter(id=subject.id).exists():
                raise PermissionDenied(
                    "Nie możesz dodać materiału do przedmiotu, którego nie prowadzisz"
                )
            serializer.save(uploaded_by=lecturer)
        else:
            serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role == 'lecturer':
            try:
                lecturer = user.lecturer_profile
            except Lecturer.DoesNotExist:
                raise PermissionDenied("Nie masz profilu wykładowcy")
            if not lecturer.subjects.filter(id=instance.subject_id).exists():
                raise PermissionDenied(
                    "Nie możesz usunąć materiału z przedmiotu, którego nie prowadzisz"
                )
        instance.delete()
