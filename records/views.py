"""
    DOCSTRING:
    This views.py file contains all the functions needed for the records app to work properly, it is composed
    of three view functions.
"""

# Imports
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from patients.models import Patient
from appointments.models import BaseConsult
from appointments.forms import RecordsDateFilterForm


def records(request):
    """
        DOCSTRING:
        This records() view is used to render the main records page, in here the user will be able to see the records that are
        related to the current user and the records with the medical_status se to true, it will retrieve the
        records using a filter, Since the results will be paginated, we need to check if the 'page' parameter exists in
        our 'GET' dictionary, depending of the value of the parameter, the function will decide which page should it return,
        if the 'page' parameters, doesn't exists, the context will be rendered, if not, then the context will be rendered
        and returned as string, so we can send it in a JSON Format. It expects only one argument, 'request', it waits for
        an object request, This view will render the content if the page is not a valid number, if it is, the response will
        be returned in JSON Format.
    """
    records_list = BaseConsult.objects.filter(created_by=request.user, medical_status=True).order_by('-datetime')
    form = RecordsDateFilterForm
    template = 'records/records_list.html'
    context = {'records': records_list, 'form': form}
    return render(request, template, context)


def filter_records(request):
    """
        This filter_records view is used to filter the records belonging to this user, depending on the parameters values inside the
        request.GET dictionary, this function will collect the 'date_from' parameter and 'date_to' parameter values and convert
        them into a datetime object, this way we can filter the records based on this values, finally we will return our response
        in JSON Format, this function also checks if the 'page' parameter is inside the querystring, if it is, then the page that
        will be rendered will be that one in the 'page' value, else the first page will be rendered.
    """
    query_date_from = datetime.strptime(request.GET.get('date_from'), '%Y-%m-%d')
    query_date_to = datetime.strptime(request.GET.get('date_to'), '%Y-%m-%d')
    filtered_records = BaseConsult.objects.filter(created_by=request.user, datetime__date__gte=query_date_from, datetime__date__lte=query_date_to, medical_status=True).order_by('-datetime')
    template = 'records/partial_records_list.html'
    context = {'records': filtered_records}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def personal_records(request, pk):
    """
        DOCSTRING:
        This personal_records function is used to retrieve all the consults records from a particular patient, these are
        going to be shown in the consult update view for that specific patient, the content will be displayed dynamically
        inside the patient records modal, so we need to send our response in JSON Format, for this we will make use of our
        render_to_string function, this function takes two arguments: 'request' which expects a request object and 'pk',
        which expects a patient's primary key.
    """
    patient = Patient.objects.get(pk=pk)
    records_list = BaseConsult.objects.filter(created_by=request.user, medical_status=True, patient=patient).order_by('-datetime')
    template = 'records/personal_records.html'
    context = {'records': records_list}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)
