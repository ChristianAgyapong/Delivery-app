"""
Authentication URL Configuration
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # Authentication endpoints
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    
    # JWT token endpoints
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoints
    path('me/', views.get_current_user, name='current_user'),
    path('profile/update/', views.update_profile, name='update_profile'),
    
    # Password management
    path('password/change/', views.change_password, name='change_password'),
    path('password/reset/', views.request_password_reset, name='password_reset'),
]