"""
    This urls.py file contains all the urls used for the home app to work properly.
"""

from django.urls import path
from .views import home

app_name = 'home'
urlpatterns = [
    path('', home, name='home'),
]
