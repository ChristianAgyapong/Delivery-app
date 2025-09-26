"""
Authentication Admin Configuration
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User admin configuration
    """
    list_display = ['email', 'full_name', 'user_type', 'is_active', 'is_verified', 'created_at']
    list_filter = ['user_type', 'is_active', 'is_verified', 'created_at']
    search_fields = ['email', 'full_name', 'phone_number']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {
            'fields': (
                'full_name', 'phone_number', 'date_of_birth',
                'address', 'avatar'
            )
        }),
        (_('Permissions'), {
            'fields': (
                'user_type', 'is_active', 'is_staff', 'is_superuser',
                'is_verified', 'groups', 'user_permissions'
            )
        }),
        (_('Location'), {
            'fields': ('current_latitude', 'current_longitude')
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'full_name', 'user_type', 'password1', 'password2'
            ),
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    User Profile admin configuration
    """
    list_display = ['user', 'get_user_type', 'is_available', 'created_at']
    list_filter = ['user__user_type', 'is_available', 'created_at']
    search_fields = ['user__email', 'user__full_name']
    raw_id_fields = ['user']
    
    def get_user_type(self, obj):
        return obj.user.user_type
    get_user_type.short_description = 'User Type'