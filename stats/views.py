"""
    DOCSTRING:
    This views.py file contains all the functions needed for the stats app to work properly.
"""

# Imports

from patients.models import Patient
from appointments.models import BaseConsult
from django.shortcuts import render
from django.core.serializers import serialize
from stats.forms import *
from django.template.loader import render_to_string
from django.http.response import HttpResponse, JsonResponse

# Create your views here.


def statistics(request):
    """
        DOCSTRING:
        This statistics function view will display the stats main view, this function accepts as it's unique parameter,
        a request object and returns a response.
    """
    template = 'stats/statistics.html'
    return render(request, template)


def patients_statistics(request):
    """
        DOCSTRING:
        This patient_statistics function view will serve the patients data in a JSON format, it makes use of the django
        serializers for this task with the specified fields.
    """
    patients = Patient.objects.filter(created_by=request.user)
    data = serialize('json', patients, fields=('gender', 'birthday', 'date_created'))
    return HttpResponse(data, content_type='application/json')


def consults_statistics(request):
    """
        DOCSTRING:
        This consults_statistics function view will serve the consults data in JSON Format, it makes use of the django
        serializer for this task with the specified fields.
    """
    consults = BaseConsult.objects.filter(created_by=request.user)
    data = serialize('json', consults, fields=('datetime', 'charge', 'created_by', 'medical_status', 'status'))
    return HttpResponse(data, content_type='application/json')


def income_statistics(request):
    pass


def process_layout(request, layout_type):
    template = None
    data_available = None
    if layout_type == 'patients':
        data_available = len(Patient.objects.filter(created_by=request.user)) >= 1
        template = 'stats/patients_data_visualization_layout.html'
    elif layout_type == 'consults':
        data_available = len(BaseConsult.objects.filter(created_by=request.user)) >= 1
        template = 'stats/consults_data_visualization_layout.html'
    context = {'data_available': data_available}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def patient_data_filter_form(request, filter_type):
    template = None
    form = None

    if filter_type == 'creation_date':
        form = PatientCreationFilterForm(user=request.user.username)
        template = 'stats/patient_creation_filter_form.html'
    elif filter_type == 'gender':
        form = GenderDistributionFilterForm
        template = 'stats/gender_distribution_filter_form.html'
    elif filter_type == 'age':
        form = AgeDistributionFilterForm
        template = 'stats/age_distribution_filter_form.html'
    elif filter_type == 'status':
        form = StatusDistributionFilterForm
        template = 'stats/status_distribution_filter_form.html'
    elif filter_type == 'medical_status':
        form = MedicalStatusDistributionFilterForm
        template = 'stats/medical_status_distribution_filter_form.html'
    elif filter_type == 'consult-count':
        form = ConsultCountFilterForm(user=request.user)
        template = 'stats/consult_count_filter_form.html'
    elif filter_type == 'hour-frequency':
        form = ConsultHourFrequencyFilterForm
        template = 'stats/consult_hour_frequency_filter_form.html'

    context = {'form': form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)



