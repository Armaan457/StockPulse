"""
ASGI config for Stock_pulse project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import InvestmentSection.routing  # Import your app's WebSocket routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Stock_pulse.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # HTTP requests go through normal Django views
    "websocket": AuthMiddlewareStack(
        URLRouter(
            InvestmentSection.routing.websocket_urlpatterns  # WebSocket routing
        )
    ),
})
