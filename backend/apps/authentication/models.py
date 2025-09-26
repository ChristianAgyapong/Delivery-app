"""
User Authentication Models

This module defines the custom User model that matches the frontend TypeScript interfaces.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
import uuid


class User(AbstractUser):
    """
    Custom User model that extends Django's AbstractUser
    Matches the frontend User interface in authService.ts
    """
    
    USER_TYPES = [
        ('customer', 'Customer'),
        ('restaurant', 'Restaurant Owner'),
        ('delivery', 'Delivery Driver'),
        ('admin', 'Admin'),
    ]
    
    # Remove username field requirement, use email as unique identifier
    username = None
    email = models.EmailField(unique=True)
    
    # Additional fields matching frontend interface
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(
        max_length=20,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be valid")],
        blank=True
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    avatar = models.ImageField(upload_to='user_avatars/', null=True, blank=True)
    
    # Profile fields
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    
    # Status fields
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Location fields for delivery drivers and customers
    current_latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'user_type']
    
    class Meta:
        db_table = 'auth_users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['user_type']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    @property
    def name(self):
        """Alias for full_name to match frontend interface"""
        return self.full_name


class UserProfile(models.Model):
    """
    Extended user profile information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Preferences
    notification_preferences = models.JSONField(default=dict, blank=True)
    dietary_restrictions = models.JSONField(default=list, blank=True)
    favorite_cuisines = models.JSONField(default=list, blank=True)
    
    # Delivery driver specific fields
    vehicle_type = models.CharField(max_length=50, blank=True)
    license_plate = models.CharField(max_length=20, blank=True)
    driver_license_number = models.CharField(max_length=50, blank=True)
    is_available = models.BooleanField(default=True)
    
    # Restaurant owner specific fields
    business_license = models.CharField(max_length=100, blank=True)
    tax_id = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"Profile of {self.user.full_name}"