from rest_framework.permissions import BasePermission


# Dostęp tylko dla administratora
class IsAdministrator(BasePermission):

    def has_permission(self, request, view):
        return request.user.role == 'admin'


# Dostęp tylko dla wykładowcy
class IsLecturer(BasePermission):

    def has_permission(self, request, view):
        return request.user.role == 'lecturer'


# Dostęp tylko dla studenta
class IsStudent(BasePermission):

    def has_permission(self, request, view):
        return request.user.role == 'student'