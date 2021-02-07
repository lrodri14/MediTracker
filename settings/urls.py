"""
    This urls.py file contains all the paths needed to route all the views in the settings app
"""

from django.urls import path
from .views import *

app_name = 'settings'
urlpatterns = [
    path('', settings, name='settings'),
    path('general', general, name='general'),
    path('change_wallpaper', change_wallpaper, name='change_wallpaper'),
    path('profile', profile, name='profile'),
    path('change_availability', change_availability, name='change_availability'),
    path('account', account, name='account'),
    path('mailing', mailing, name='mailing'),
    path('update_mailing_info', update_mailing_information, name='update_mailing_information'),
    path('medical_test_list', medical_testing_list, name='medical_test_list'),
    path('filter_medical_testing', filter_medical_testing, name='filter_medical_testing'),
    path('medical_tests_type_filter', medical_test_type_filter, name='medical_test_type_filter'),
    path('add_medical_test', add_medical_test, name='add_medical_test'),
    path('medical_test_details/<int:pk>', medical_test_details, name='medical_test_details'),
    path('update_medical_test/<int:pk>', update_medical_test, name='update_medical_test'),
    path('delete_medical_test/<int:pk>', delete_medical_test, name='delete_medical_test'),
    path('insurance_list', insurance_list, name='insurance_list'),
    path('filter_insurance', filter_insurance, name='filter_insurance'),
    path('add_insurance', add_insurance_carrier, name='add_insurance'),
    path('insurance_details/<int:pk>', insurance_details, name='insurance_details'),
    path('update_insurance/<int:pk>', update_insurance, name='update_insurance'),
    path('delete_insurance/<int:pk>', delete_insurance, name='delete_insurance'),
    path('allergy_list', allergy_list, name='allergy_list'),
    path('filtered_allergies', filter_allergies, name='filter_allergies'),
    path('allergy_add', add_allergy, name='add_allergy'),
    path('allergies_details/<int:pk>', allergy_details, name='allergy_details'),
    path('allergies_update/<int:pk>', update_allergy, name='update_allergy'),
    path('allergies_delete/<int:pk>', delete_allergy, name='delete_allergy'),
    path('drugs_list', drug_list, name='drugs_list'),
    path('filtered_drugs', filter_drugs, name='filter_drugs'),
    path('drug_category_filter', drug_category_filter, name='drug_category'),
    path('drug_add', add_drug, name='add_drug'),
    path('drug_details/<int:pk>', drug_details, name='drug_details'),
    path('update_drug/<int:pk>', update_drug, name='update_drug'),
    path('delete_drug/<int:pk>', delete_drug, name='delete_drug'),
]
