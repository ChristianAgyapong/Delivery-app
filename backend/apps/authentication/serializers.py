"""
Authentication Serializers

This module contains DRF serializers for authentication-related models
that match the frontend TypeScript interfaces.
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User, UserProfile


class UserSerializer(serializers.ModelSerializer):
    """
    User serializer that matches the frontend User interface
    """
    name = serializers.CharField(source='full_name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'full_name', 'phone_number',
            'user_type', 'avatar', 'date_of_birth', 'address',
            'is_active', 'is_verified', 'created_at', 'updated_at',
            'current_latitude', 'current_longitude'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    User profile serializer for extended profile information
    """
    class Meta:
        model = UserProfile
        fields = [
            'notification_preferences', 'dietary_restrictions', 'favorite_cuisines',
            'vehicle_type', 'license_plate', 'driver_license_number', 'is_available',
            'business_license', 'tax_id'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    User registration serializer
    Matches frontend signup interface
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'full_name',
            'phone_number', 'user_type', 'date_of_birth', 'address'
        ]
    
    def validate(self, attrs):
        """
        Validate password confirmation
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Password fields do not match.'
            })
        return attrs
    
    def create(self, validated_data):
        """
        Create user with encrypted password
        """
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    User login serializer that handles authentication
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # Use email as username for authentication
            user = authenticate(username=email, password=password)
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Invalid email or password.')
        else:
            raise serializers.ValidationError('Must include email and password.')


class PasswordResetSerializer(serializers.Serializer):
    """
    Password reset request serializer
    """
    email = serializers.EmailField()


class PasswordChangeSerializer(serializers.Serializer):
    """
    Password change serializer
    """
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Password fields do not match.'
            })
        return attrs