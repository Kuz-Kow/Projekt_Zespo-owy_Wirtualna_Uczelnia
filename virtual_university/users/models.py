from django.contrib.auth.models import AbstractUser
from django.db import models


# Model użytkownika bazowy dla całego systemu
class User(AbstractUser):

    ROLE_CHOICES = (
        ('student', 'Student'),
        ('lecturer', 'Wykładowca'),
        ('admin', 'Administrator'),
    )

    # Pole określające rolę użytkownika
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # Dodatkowe dane zgodne z diagramem klas
    index_number = models.CharField(max_length=20, blank=True, null=True)
    academic_title = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"