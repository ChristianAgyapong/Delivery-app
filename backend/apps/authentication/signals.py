"""
Authentication Signals

Django signals for handling post-save operations on User model
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatically create UserProfile when User is created
    """
    if created:
        UserProfile.objects.get_or_create(user=instance)