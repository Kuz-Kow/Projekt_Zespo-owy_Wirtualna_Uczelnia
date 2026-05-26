from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from university.models import FieldOfStudy, Subject, Student, Lecturer, ClassSchedule, Grade, CourseMaterial

User = get_user_model()


class Command(BaseCommand):
    help = 'Wypełnia bazę danych przykładowymi danymi'

    def handle(self, *args, **options):
        self.stdout.write('Czyszczenie bazy danych...')
        Grade.objects.all().delete()
        CourseMaterial.objects.all().delete()
        ClassSchedule.objects.all().delete()
        Student.objects.all().delete()
        Lecturer.objects.all().delete()
        Subject.objects.all().delete()
        FieldOfStudy.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write('Tworzenie danych demo...')

        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@uczelnia.pl',
                'first_name': 'Admin',
                'last_name': 'Systemowy',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()
        Token.objects.get_or_create(user=admin_user)
        self.stdout.write('  Admin: admin / admin123')

        lecturer_user, _ = User.objects.get_or_create(
            username='wykladowca',
            defaults={
                'email': 'maria.kowalska@uczelnia.pl',
                'first_name': 'Maria',
                'last_name': 'Kowalska',
                'role': 'lecturer',
                'academic_title': 'Dr hab.',
            }
        )
        lecturer_user.set_password('lecturer123')
        lecturer_user.save()
        Token.objects.get_or_create(user=lecturer_user)
        self.stdout.write('  Wykładowca: wykladowca / lecturer123')

        student_user, _ = User.objects.get_or_create(
            username='student',
            defaults={
                'email': 'jan.nowak@student.uczelnia.pl',
                'first_name': 'Jan',
                'last_name': 'Nowak',
                'role': 'student',
                'index_number': '123456',
            }
        )
        student_user.set_password('student123')
        student_user.save()
        Token.objects.get_or_create(user=student_user)
        self.stdout.write('  Student: student / student123')

        field, _ = FieldOfStudy.objects.get_or_create(
            name='Informatyka',
            defaults={
                'faculty': 'Wydział Informatyki',
                'num_semesters': 4,
            }
        )
        self.stdout.write(f'  Kierunek: Informatyka ({field.num_semesters} semestry)')

        subjects = []
        subjects_data = [
            ('Programowanie w Python', 60, 1, field),
            ('Bazy danych', 45, 1, field),
            ('Sieci komputerowe', 45, 2, field),
        ]
        for name, hours, semester, field_obj in subjects_data:
            subj, _ = Subject.objects.get_or_create(
                name=name,
                defaults={
                    'hours': hours,
                    'semester': semester,
                    'field_of_study': field_obj,
                }
            )
            subjects.append(subj)
        self.stdout.write(f'  Przedmioty: {[s.name for s in subjects]}')

        lecturer, _ = Lecturer.objects.get_or_create(user=lecturer_user)
        lecturer.subjects.set(subjects)
        lecturer.save()
        self.stdout.write(f'  Wykładowca przypisany do {len(subjects)} przedmiotów')

        student, _ = Student.objects.get_or_create(
            user=student_user,
            defaults={
                'semester': 1,
                'year': 1,
                'field_of_study': field,
            }
        )
        student.subjects.set(subjects[:2])
        student.save()
        self.stdout.write(f'  Student zapisany na: Informatyka, semestr 1')

        import datetime
        schedules_data = [
            (subjects[0], lecturer, 'MON', '10:00', '11:30', '101'),
            (subjects[0], lecturer, 'WED', '12:00', '13:30', '101'),
            (subjects[1], lecturer, 'TUE', '09:00', '10:30', '102'),
            (subjects[2], lecturer, 'THU', '14:00', '15:30', '104'),
            (subjects[2], lecturer, 'FRI', '11:00', '12:30', '104'),
        ]
        for subj, lec, day, start, end, room in schedules_data:
            ClassSchedule.objects.get_or_create(
                subject=subj,
                lecturer=lec,
                day_of_week=day,
                start_time=datetime.time.fromisoformat(start),
                end_time=datetime.time.fromisoformat(end),
                room=room,
            )
        self.stdout.write(f'  Plan zajęć: {len(schedules_data)} pozycji')

        grades_data = [
            (student, subjects[0], lecturer, 4.5),
            (student, subjects[1], lecturer, 5.0),
        ]
        for stud, subj, lec, val in grades_data:
            Grade.objects.get_or_create(
                student=stud,
                subject=subj,
                lecturer=lec,
                defaults={'value': val},
            )
        self.stdout.write(f'  Oceny: {len(grades_data)}')

        materials_data = [
            (subjects[0], 'Wprowadzenie do Pythona', 'Podstawy języka Python'),
            (subjects[0], 'Pętle i funkcje', 'Instrukcje sterujące i funkcje'),
            (subjects[1], 'SQL podstawy', 'Język zapytań SQL'),
        ]
        for subj, title, desc in materials_data:
            CourseMaterial.objects.get_or_create(
                title=title,
                defaults={
                    'description': desc,
                    'subject': subj,
                    'uploaded_by': lecturer,
                }
            )
        self.stdout.write(f'  Materiały: {len(materials_data)}')

        self.stdout.write(self.style.SUCCESS('Dane demo zostały pomyślnie utworzone!'))
        self.stdout.write('')
        self.stdout.write('  Zaloguj się jako:')
        self.stdout.write('    admin / admin123  - Administrator')
        self.stdout.write('    wykladowca / lecturer123  - Wykładowca')
        self.stdout.write('    student / student123  - Student')