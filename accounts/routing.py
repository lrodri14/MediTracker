from django.urls import path
from .consumers import WSNotifications, ChatWS

ws_urlpatterns = [
    path('', WSNotifications.as_asgi()),
    path('chat', ChatWS.as_asgi()),
]
