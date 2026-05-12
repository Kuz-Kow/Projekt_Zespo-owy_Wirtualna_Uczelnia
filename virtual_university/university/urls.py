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

router.register(r'fields', FieldOfStudyViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'students', StudentViewSet)
router.register(r'lecturers', LecturerViewSet)
router.register(r'schedules', ClassScheduleViewSet)
router.register(r'grades', GradeViewSet)

urlpatterns = router.urls