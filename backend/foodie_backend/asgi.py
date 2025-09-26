"""
ASGI config for foodie_backend project.
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foodie_backend.settings')

django_asgi_app = get_asgi_application()

# For now, only HTTP. WebSocket routing will be added when we implement real-time features
application = ProtocolTypeRouter({
    'http': django_asgi_app,
    # 'websocket': AuthMiddlewareStack(
    #     URLRouter([
    #         # WebSocket URL patterns will go here
    #     ])
    # ),
})