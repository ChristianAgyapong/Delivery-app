"""
Authentication App Configuration
"""

from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'
    
    def ready(self):
        """Import signals when the app is ready"""
        try:
            import apps.authentication.signals
        except ImportError:
            pass