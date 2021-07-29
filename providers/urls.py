"""
    This urls.py contains all the urls needed to route all the views in our Providers App
    It contains two sections: 'Providers related views' and 'Visitors related views
"""
# Imports
from django.urls import path
from .views import *
from utilities.global_utilities import collect_country_number_code


app_name = 'providers'
urlpatterns = [
    # Main Page
    path('', providers, name='providers'),
    # Providers related views
    path('collect_country_number_code', collect_country_number_code, name='collect_country_number_code'),
    path('providers_list', providers_list, name='providers_list'),
    path('filter_providers', filter_providers, name='filter_providers'),
    path('create_provider', create_provider, name='create_provider'),
    path('provider_details/<int:pk>', provider_details, name='provider_details'),
    path('update_provider/<int:pk>', update_provider, name='update_provider'),
    path('delete_provider/<int:pk>', delete_provider, name='delete_provider'),
    # Visitors related views
    path('visitors', visitors_list, name='visitors'),
    path('visitors_filter', filter_visitors, name='filter_visitors'),
    path('create_visitor', create_visitor, name='create_visitor'),
    path('visitor_details/<int:pk>', visitor_details, name='visitor_details'),
    path('update_visitor/<int:pk>', update_visitor, name='update_visitor'),
    path('delete_visitor/<int:pk>', delete_visitor, name='delete_visitor'),
    # Email Sending
    path('send_provider_email', send_providers_email, name='send_provider_email'),
    path('send_provider_email/<int:pk>', send_providers_email, name='send_provider_email'),
    path('send_visitor_email', send_visitors_email, name='send_visitor_email'),
    path('send_visitor_email/<int:pk>', send_visitors_email, name='send_visitor_email')
]
