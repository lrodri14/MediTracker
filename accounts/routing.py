from django.urls import path
from .consumers import WSNotifications

ws_urlpatterns = [
    path('', WSNotifications.as_asgi()),
]
