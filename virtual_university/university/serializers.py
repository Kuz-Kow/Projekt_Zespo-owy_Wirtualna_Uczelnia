from rest_framework import serializers

from .models import (
    FieldOfStudy,
    Subject,
    Student,
    Lecturer,
    ClassSchedule,
    Grade,
    CourseMaterial
)


class FieldOfStudySerializer(serializers.ModelSerializer):
    """Serializator dla kierunków studiów"""
    class Meta:
        model = FieldOfStudy
        fields = ['id', 'name', 'faculty', 'num_semesters']


class SubjectSerializer(serializers.ModelSerializer):
    """Serializator dla przedmiotów"""
    field_of_study_name = serializers.CharField(source='field_of_study.name', read_only=True)
    lecturers = serializers.PrimaryKeyRelatedField(many=True, queryset=Lecturer.objects.all(), required=False)
    lecturers_names = serializers.SerializerMethodField()
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'hours', 'semester', 'field_of_study', 'field_of_study_name', 'lecturers', 'lecturers_names']
    
    def get_lecturers_names(self, obj):
        return [str(l) for l in obj.lecturers.all()]


class StudentSerializer(serializers.ModelSerializer):
    """Serializator dla studentów"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    field_of_study_name = serializers.CharField(source='field_of_study.name', read_only=True)
    subjects_names = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = [
            'id', 'user', 'user_email', 'user_first_name', 'user_last_name',
            'semester', 'year', 'field_of_study', 'field_of_study_name', 'subjects', 'subjects_names'
        ]
    
    def get_subjects_names(self, obj):
        """Pobranie nazw przedmiotów studenta"""
        return [subject.name for subject in obj.subjects.all()]


class LecturerSerializer(serializers.ModelSerializer):
    """Serializator dla wykładowców"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    academic_title = serializers.CharField(source='user.academic_title', read_only=True)
    subjects_names = serializers.SerializerMethodField()
    
    class Meta:
        model = Lecturer
        fields = [
            'id', 'user', 'user_email', 'user_first_name', 'user_last_name',
            'academic_title', 'subjects', 'subjects_names'
        ]
    
    def get_subjects_names(self, obj):
        """Pobranie nazw przedmiotów wykładowcy"""
        return [subject.name for subject in obj.subjects.all()]


class ClassScheduleSerializer(serializers.ModelSerializer):
    """Serializator dla harmonogramu zajęć"""
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.user.get_full_name', read_only=True)
    
    class Meta:
        model = ClassSchedule
        fields = [
            'id', 'subject', 'subject_name', 'lecturer', 'lecturer_name',
            'day_of_week', 'start_time', 'end_time', 'room'
        ]


class CourseMaterialSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.user.get_full_name', read_only=True)

    class Meta:
        model = CourseMaterial
        fields = ['id', 'title', 'description', 'subject', 'subject_name', 'uploaded_by', 'uploaded_by_name', 'created_at']


class GradeSerializer(serializers.ModelSerializer):
    """Serializator dla ocen"""
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.user.get_full_name', read_only=True)
    
    class Meta:
        model = Grade
        fields = [
            'id', 'student', 'student_name', 'subject', 'subject_name',
            'lecturer', 'lecturer_name', 'value', 'date_assigned'
        ]
        read_only_fields = ['lecturer']
