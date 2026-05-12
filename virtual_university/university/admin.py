from django.contrib import admin
from .models import (
    FieldOfStudy,
    Subject,
    Student,
    Lecturer,
    ClassSchedule,
    Grade
)

admin.site.register(FieldOfStudy)
admin.site.register(Subject)
admin.site.register(Student)
admin.site.register(Lecturer)
admin.site.register(ClassSchedule)
admin.site.register(Grade)