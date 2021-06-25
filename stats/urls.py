"""
    DOCSTRING:
    This urls.py file contains all the urls needed to route every single view from the .views.py file in this app.
"""

# Imports
from django.urls import path
from stats.views import *

app_name = 'stats'
urlpatterns = [
    path('stats', statistics, name='stats'),
    path('patients_statistics', patients_statistics, name='patients_statistics'),
    path('consults_statistics', consults_statistics, name='consults_statistics'),
    path('income_statistics', income_statistics, name='income_statistics'),
    path('process/<str:layout_type>', process_layout, name='process_layout')
]
