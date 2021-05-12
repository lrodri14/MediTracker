"""
    This views.py file contains all the urls necessary to route all the views, it is composed of 5 routes.
"""

# Imports
from django.urls import path
from .views import *
from utilities.global_utilities import collect_country_number_code

app_name = 'patients'
urlpatterns = [
    path('', patients, name='patients'),
    path('filter_patients', filter_patients, name='filter_patients'),
    path('add_patient/', add_patient, name='add_patient'),
    path('details/<int:pk>', patient_details, name='patients_details'),
    path('filter_patient_details', filter_patient_details, name='filter_patient_details'),
    path('filter_patient_details/<int:pk>', filter_patient_details, name='filter_patient_details'),
    path('update/<int:pk>', update_patient, name='update_patient'),
    path('delete/<int:pk>', delete_patient, name='delete_patient'),
    path('send_email', send_email, name='send_email'),
    path('send_email/<int:pk>', send_email, name='send_email'),
    path('collect_country_number_code', collect_country_number_code, name='collect_country_number_code'),
]
