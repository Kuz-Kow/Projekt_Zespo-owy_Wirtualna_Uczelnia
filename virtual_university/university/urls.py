from rest_framework.routers import DefaultRouter

from .views import (
    FieldOfStudyViewSet,
    SubjectViewSet,
    StudentViewSet,
    LecturerViewSet,
    ClassScheduleViewSet,
    GradeViewSet
)

router = DefaultRouter()

router.register(r'fields', FieldOfStudyViewSet, basename='field')
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'lecturers', LecturerViewSet, basename='lecturer')
router.register(r'schedules', ClassScheduleViewSet, basename='schedule')
router.register(r'grades', GradeViewSet, basename='grade')

urlpatterns = router.urls