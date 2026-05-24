from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import login_view, demo_login_view, user_profile_view, logout_view, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('login', login_view, name='login'),
    path('demo', demo_login_view, name='demo_login'),
    path('profile', user_profile_view, name='user_profile'),
    path('logout', logout_view, name='logout'),
    path('', include(router.urls)),
]
