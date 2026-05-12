from django.urls import path
from .views import login_view, demo_login_view, user_profile_view, logout_view

urlpatterns = [
    path('login', login_view, name='login'),
    path('demo', demo_login_view, name='demo_login'),
    path('profile', user_profile_view, name='user_profile'),
    path('logout', logout_view, name='logout'),
]
