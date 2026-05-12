from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User


# Kierunek studiów
class FieldOfStudy(models.Model):

    name = models.CharField(max_length=255)
    faculty = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Fields of Study"


# Przedmiot
class Subject(models.Model):

    name = models.CharField(max_length=255)
    hours = models.IntegerField()
    semester = models.IntegerField()

    # Relacja do kierunku
    field_of_study = models.ForeignKey(
        FieldOfStudy,
        on_delete=models.CASCADE,
        related_name='subjects'
    )

    def __str__(self):
        return self.name


# Student
class Student(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )

    semester = models.IntegerField(default=1)
    year = models.IntegerField(default=1)

    # Student przypisany do kierunku
    field_of_study = models.ForeignKey(
        FieldOfStudy,
        on_delete=models.SET_NULL,
        null=True,
        related_name='students'
    )

    # Przedmioty realizowane przez studenta
    subjects = models.ManyToManyField(Subject)

    def __str__(self):
        return self.user.get_full_name()


# Wykładowca
class Lecturer(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='lecturer_profile'
    )

    # Przedmioty wykładane przez wykładowcę
    subjects = models.ManyToManyField(Subject, related_name='lecturers')

    def __str__(self):
        return self.user.get_full_name()


# Harmonogram zajęć
class ClassSchedule(models.Model):

    DAY_CHOICES = (
        ('MON', 'Poniedziałek'),
        ('TUE', 'Wtorek'),
        ('WED', 'Środa'),
        ('THU', 'Czwartek'),
        ('FRI', 'Piątek'),
        ('SAT', 'Sobota'),
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='schedules'
    )

    lecturer = models.ForeignKey(
        Lecturer,
        on_delete=models.CASCADE,
        related_name='schedules'
    )

    day_of_week = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.subject} - {self.day_of_week} {self.start_time}"


# Oceny
class Grade(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='grades'
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='grades'
    )

    lecturer = models.ForeignKey(
        Lecturer,
        on_delete=models.CASCADE,
        related_name='grades'
    )

    value = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )

    date_assigned = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.value}"