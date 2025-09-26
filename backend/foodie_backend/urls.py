"""
URL configuration for foodie_backend project.

The `urlpatterns` list routes URLs to views.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from django.http import JsonResponse

def api_root(request):
    """API root endpoint with available endpoints"""
    return JsonResponse({
        'message': 'Welcome to FoodieExpress API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/v1/auth/',
            'restaurants': '/api/v1/restaurants/',
            'orders': '/api/v1/orders/',
            'payments': '/api/v1/payments/',
            'delivery': '/api/v1/delivery/',
            'notifications': '/api/v1/notifications/',
            'admin': '/api/v1/admin-panel/',
            'docs': '/api/docs/',
            'schema': '/api/schema/',
        }
    })

# API URL patterns
api_urlpatterns = [
    path('', api_root, name='api_root'),
    path('auth/', include('apps.authentication.urls')),
    path('restaurants/', include('apps.restaurants.urls')),
    path('orders/', include('apps.orders.urls')),
    path('payments/', include('apps.payments.urls')),
    path('delivery/', include('apps.delivery.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('admin-panel/', include('apps.admin_panel.urls')),
]

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/', include(api_urlpatterns)),
    
    # API documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)