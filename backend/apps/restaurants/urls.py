"""
Restaurant URL Configuration
"""

from django.urls import path
from . import views

app_name = 'restaurants'

urlpatterns = [
    # Restaurant endpoints
    path('', views.restaurant_list, name='restaurant_list'),
    path('<uuid:restaurant_id>/', views.restaurant_detail, name='restaurant_detail'),
    path('<uuid:restaurant_id>/menu/', views.restaurant_menu, name='restaurant_menu'),
]