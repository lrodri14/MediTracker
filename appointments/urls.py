"""
    DOCSTRING:
    This urls.py file contains all the urls needed to route every single view from the .views.py file in this app.
"""

# Imports
from django.urls import path
from .views import *

app_name = 'appointments'
urlpatterns = [
    path('', appointments, name='appointments'),
    path('create_appointment', create_appointment, name='create_appointment'),
    path('create_appointment/<int:pk>', create_appointment, name='create_appointment'),
    path('consult_details/<int:pk>', consults_details, name='consult_details'),
    path('consult_summary/<int:pk>', consult_summary, name='consult_summary'),
    path('update_consult/<int:pk>', update_consult, name='update_consult'),
    path('cancel_appointment/<int:pk>', cancel_appointment, name='cancel_appointment'),
    path('add_vaccination_record/<int:pk>', add_vaccination_record, name='add_vaccination_record'),
    path('update_vaccination_record/<int:record_pk>/<int:patient_pk>', update_vaccination_record, name='update_vaccination_record'),
    path('vaccination_record_details/<int:pk>', vaccination_record_details, name='vaccination_record_details'),
    path('delete_vaccination_record/<int:record_pk>/<int:patient_pk>', delete_vaccination_record, name='delete_vaccination_record'),
    # path('appoint_surgery/<int:pk>', appoint_surgery, name='appoint_surgery'),
    # path('update_surgery_record/<int:pk>', update_surgery_record, name='update_surgery_record'),
    # path('surgery_details/<int:pk>', surgery_details, name='surgery_details'),
    # path('cancel_surgery_appointment', cancel_surgery_appointment, name='cancel_surgery_appointment'),
    path('agenda/', agenda, name='agenda'),
    path('filter_agenda/', filter_agenda, name='filter_agenda'),
    path('registers', registers, name='registers'),
    path('filter_registers', filter_registers, name='filter_registers'),
    path('confirm_appointment/<int:pk>', confirm_appointment, name='confirm_appointment'),
    path('appointment_date_update/<int:pk>', appointment_date_update, name='appointment_date_update'),
]
