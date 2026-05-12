from rest_framework.permissions import BasePermission


# Dostęp tylko dla administratora
class IsAdministrator(BasePermission):
    """
    Sprawdza czy użytkownik ma rolę administratora.
    """
    def has_permission(self, request, view):
        # Najpierw sprawdź czy użytkownik jest uwierzytelniony
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Sprawdź rolę administratora
        return request.user.role == 'admin'


# Dostęp tylko dla wykładowcy
class IsLecturer(BasePermission):
    """
    Sprawdza czy użytkownik ma rolę wykładowcy.
    """
    def has_permission(self, request, view):
        # Najpierw sprawdź czy użytkownik jest uwierzytelniony
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Sprawdź rolę wykładowcy
        return request.user.role == 'lecturer'


# Dostęp tylko dla studenta
class IsStudent(BasePermission):
    """
    Sprawdza czy użytkownik ma rolę studenta.
    """
    def has_permission(self, request, view):
        # Najpierw sprawdź czy użytkownik jest uwierzytelniony
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Sprawdź rolę studenta
        return request.user.role == 'student'


# Dostęp dla wykładowcy lub administratora
class IsLecturerOrAdmin(BasePermission):
    """
    Sprawdza czy użytkownik jest wykładowcą lub administratorem.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.role in ['lecturer', 'admin']


# Dostęp dla studenta lub wykładowcy
class IsStudentOrLecturer(BasePermission):
    """
    Sprawdza czy użytkownik jest studentem lub wykładowcą.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.role in ['student', 'lecturer']
