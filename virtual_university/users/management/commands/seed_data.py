from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from university.models import FieldOfStudy, Subject, Student, Lecturer, ClassSchedule, Grade

User = get_user_model()


class Command(BaseCommand):
    help = 'Wypełnia bazę danych przykładowymi danymi'

    def handle(self, *args, **options):
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
        self.stdout.write(f'  Admin: admin / admin123')

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
        self.stdout.write(f'  Wykładowca: wykladowca / lecturer123')

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
        self.stdout.write(f'  Student: student / student123')

        student2_user, _ = User.objects.get_or_create(
            username='student2',
            defaults={
                'email': 'anna.kwiatkowska@student.uczelnia.pl',
                'first_name': 'Anna',
                'last_name': 'Kwiatkowska',
                'role': 'student',
                'index_number': '123457',
            }
        )
        student2_user.set_password('student123')
        student2_user.save()
        Token.objects.get_or_create(user=student2_user)
        self.stdout.write(f'  Student2: student2 / student123')

        field, _ = FieldOfStudy.objects.get_or_create(
            name='Informatyka',
            faculty='Wydział Informatyki i Telekomunikacji'
        )
        field2, _ = FieldOfStudy.objects.get_or_create(
            name='Matematyka',
            faculty='Wydział Matematyki i Fizyki'
        )
        self.stdout.write('  Kierunki: Informatyka, Matematyka')

        subjects_data = [
            ('Programowanie w Python', 60, 1, field),
            ('Bazy danych', 45, 1, field),
            ('Systemy operacyjne', 30, 2, field),
            ('Sieci komputerowe', 45, 2, field),
            ('Analiza matematyczna', 60, 1, field2),
            ('Algebra liniowa', 45, 1, field2),
        ]
        subjects = []
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
        self.stdout.write(f'  Przedmioty: {len(subjects)} utworzonych')

        lecturer, _ = Lecturer.objects.get_or_create(user=lecturer_user)
        lecturer.subjects.set(subjects[:4])
        lecturer.save()

        student, _ = Student.objects.get_or_create(
            user=student_user,
            defaults={
                'semester': 2,
                'year': 1,
                'field_of_study': field,
            }
        )
        student.subjects.set(subjects[:4])
        student.save()

        student2, _ = Student.objects.get_or_create(
            user=student2_user,
            defaults={
                'semester': 1,
                'year': 1,
                'field_of_study': field,
            }
        )
        student2.subjects.set(subjects[:4])
        student2.save()

        self.stdout.write('  Profile studentów i wykładowcy powiązane')

        import datetime
        schedules_data = [
            (subjects[0], lecturer, 'MON', '10:00', '11:30', '101'),
            (subjects[1], lecturer, 'TUE', '12:00', '13:30', '102'),
            (subjects[2], lecturer, 'WED', '10:00', '11:30', '103'),
            (subjects[3], lecturer, 'THU', '14:00', '15:30', '104'),
            (subjects[4], lecturer, 'FRI', '09:00', '10:30', '201'),
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
        self.stdout.write('  Plan zajęć utworzony')

        grades_data = [
            (student, subjects[0], lecturer, 4.5),
            (student, subjects[1], lecturer, 5.0),
            (student, subjects[2], lecturer, 3.5),
            (student2, subjects[0], lecturer, 4.0),
            (student2, subjects[1], lecturer, 3.5),
        ]
        for stud, subj, lec, val in grades_data:
            Grade.objects.get_or_create(
                student=stud,
                subject=subj,
                lecturer=lec,
                defaults={'value': val},
            )
        self.stdout.write(f'  Oceny: {len(grades_data)} utworzonych')

        self.stdout.write(self.style.SUCCESS('Dane demo zostały pomyślnie utworzone!'))
