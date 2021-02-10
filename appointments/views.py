"""
    This views.py contains all the synchronous functions and asynchronous functions needed or required for the Appointments,
    there is also a new loop created to run the asynchronous functions, it is stored inside 'loop' variable, this file
    is composed of two async functions and fourteen synchronous functions, twelve of them views.
"""

# Imports
import asyncio
from datetime import datetime
from django.db.models import Q
from meditracker import settings
from django.utils import timezone
from django.shortcuts import render
from django.http import JsonResponse
from django.db import IntegrityError
from django.shortcuts import redirect
from django.contrib.auth.models import Group
from .models import Consult, MedicalTestResult
from django.template.loader import render_to_string
from .forms import ConsultForm, DrugForm, DrugCategoryFilterForm, MedicalTestForm, MedicalTestTypeFilterForm, \
    UpdateConsultForm, MedicalTestResultFormset, AgendaDateFilterForm, RegisterFilterForm
from utilities.appointments_utilities import evaluate_consult, generate_pdf, send_sms, check_delayed_consults, \
    collect_months_names, filter_conditional_results

# Import is unused because we will use it in a future update.
from .tasks import save_new_drug

# New Event Loop
loop = asyncio.new_event_loop()

# Create your views here.


def appointments(request):
    """
        DOCSTRING:
        This appointments() view is used to render the main appointments page, in here the user will be able to see the appointments that are
        pending for the current date and also the consults that were locked for further changes, it will retrieve the
        appointments using a filter, also this view will check if the user who requested this page belongs to the Doctor's
        group, this for editing logic that will be managed in the template. Since the results will be paginated, we need to
        check if the 'page' parameter exists in our 'GET' dictionary, depending of the value of the parameter, the
        function will decide which page should it return, if the 'page' parameters, doesn't exists, the context will be
        rendered, if not, then the context will be rendered and returned as string, so we can send it in a JSON Format.
        It expects only one argument, 'request', it waits for an object request, This view will render the content if
        the page is not a valid number, if it is, the response will be returned in JSON Format.
    """
    today = timezone.localtime()
    doctor_group = Group.objects.get(name='Doctor')
    doctor = doctor_group in request.user.groups.all()
    appointments_list = Consult.objects.filter(Q(created_by=request.user, datetime__date=today.date(), medical_status=False, status='CONFIRMED') | Q(created_by=request.user, lock=False)).order_by('datetime')
    template = 'appointments/appointments.html'
    context = {'appointments': appointments_list, 'doctor': doctor}
    return render(request, template, context)


def create_appointment(request):
    """
        DOCSTRING:
        This create_appointment() view processes consult instance creation logic, if the request.method is a 'GET' then
        the view will instantiate the ConsultForm and pass the request.user to the class, this because we need to manage
        some logic inside this class, such as the displaying of patients only related to the current user, the only thing
        inside our view context is this form, we will return the data in JSON Format, so the rendering we convert it into a
        string with the use of the render_to_string() function, and send the data as a JSONResponse, if the request.method is
        a 'POST', then we populate the form with the content inside the request.POST dictionary, and we check if the form is valid,
        if it is, then the consult will be saved and added to the agenda so we can then confirm it, edit it or cancel it,
        if the form is not valid, then we will add a custom error to the context and render the template again so
        we can send it back as a JSONResponse. This view only expects an argument, 'request', should be a request object.
    """
    consults_form = ConsultForm(user=request.user)
    template = 'appointments/create_appointment.html'
    context = {}
    data = {}
    if request.method == 'POST':
        consults_form = ConsultForm(request.POST, user=request.user)
        if consults_form.is_valid():
            try:
                consult = consults_form.save(commit=False)
                consult.created_by = request.user
                consult.save()
                loop.run_until_complete(send_sms(consult))
                data['success'] = 'Consult created successfully'
            except IntegrityError:
                date = consults_form.cleaned_data.get('datetime').date()
                time = consults_form.cleaned_data.get('datetime').time().strftime('%I:%M:%S %p')
                context['error'] = 'There is already a reservation for {} at {}'.format(date, time)
    context['consults_form'] = consults_form
    data['html'] = render_to_string(template, context, request)
    return JsonResponse(data)


def consults_details(request, pk):
    """
        DOCSTRING:
        This consult_details() view is used to display the details of a single consult, as well as the exams related to
        that consult in case there are, this view will also check for the HTTP_REFERER headers, this so it can know where
        to redirect if the user wants to go to the page it was before. It takes two arguments, 'request' which expects
        a request object, and 'pk', which expects the pk of a specific consult.
    """
    consult = Consult.objects.get(pk=pk)
    exams = MedicalTestResult.objects.filter(consult=consult) if len(MedicalTestResult.objects.filter(consult=consult)) > 0 else None
    template = 'appointments/consult_details.html'
    context = {'consult': consult, 'exams': exams}
    if 'patients/details' in request.META.get('HTTP_REFERER'):
        context['referer'] = 'details'
    else:
        context['referer'] = 'appointments'
    return render(request, template, context)


def consult_summary(request, pk):
    """
        DOCSTRING:
        This consult_summary() view is used to display the summary of a single consults, it will only display the motive
        and suffering of the patient, which is why he attended that day, if there were any diagnose or treatments, they
        will displayed as well, the result of this view will be displayed inside the consults update template, so the
        response must be sent in JSON Format, we use the render_to_string function to convert it into a string and we
        send the response as a JSON Response. It takes two arguments, 'request' which expects a request object, and
        'pk', which expects the pk of a specific consult.
    """
    consult = Consult.objects.get(pk=pk)
    template = 'appointments/consult_summary.html'
    context = {'consult': consult}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def update_consult(request, pk):
    """
        DOCSTRING:
        This update_consult() view is used to fill up consults that were created with the create_consult() view, It is
        used to fill a consult with real data from the patient, we use 4 different forms inside this view, 'UpdateConsultsForm'
        used to fill consults with data from the patient, 'MedicalExamsFormset' used to create as many exams instances for
        this consult as needed, 'DrugsForm' used to create drugs asynchronously and 'DrugCategoryFilterForm' used to filter
        drugs inside the consult. If the request.method is a 'GET' method, then it will render the template with these 4
        forms and display it to the user in the response. If the request.method is 'POST' then 'UpdateConsultForm' and the
        'MedicalExamsFormset' will be populated with the request.POST dictionary content and check if both of them is valid,
        they won't be saved and commited yet, there are a few things we need to check before, for each exam in the medi-
        cal exams formset, we need to check if there are any forms with the DELETE attribute set to True, each of them
        which contains the check will be deleted and not saved and set the consult attribute to the current consult,
        the rest will be commited, for the consult we will set it's medical_status attribute to True, when this is done
        we will save the many to many relationship with the drugs if needed. If there was an error with the medical exams,
        then a custom error will be added to the context and the template will be rendered again. It takes two arguments,
        'request' which expects a request object and 'pk' which expects a consult's pk Finally, the evaluate_consult function
        will be called to inspect if any important indications or prescriptions for the patient where made in order to
        handle the user a receipt for the patient, if this function returns True, then the create_pdf function will be called
        and the prescription will be created, afterwards the prescription's path will be sent to the user in JsonFormat.
    """
    consult = Consult.objects.get(pk=pk)
    consult_form = UpdateConsultForm(request.POST or None, user=request.user, instance=consult)
    medical_test_result_formset = MedicalTestResultFormset(instance=consult)
    drug_form = DrugForm
    drug_category_filter_form = DrugCategoryFilterForm
    medical_test_form = MedicalTestForm
    medical_test_filter_form = MedicalTestTypeFilterForm
    template = 'appointments/update_consult.html'
    context = {'consult': consult, 'consult_form': consult_form, 'medical_test_result_formset': medical_test_result_formset,
               'drug_form': drug_form, 'drug_category_filter_form': drug_category_filter_form, 'medical_test_form': medical_test_form,
               'medical_test_filter_form': medical_test_filter_form}
    if request.method == 'POST':
        consult_form = UpdateConsultForm(request.POST or None, user=request.user, instance=consult)
        medical_exams_form = MedicalTestResultFormset(request.POST, request.FILES, instance=consult)
        if consult_form.is_valid() and medical_exams_form.is_valid():
            consult = consult_form.save(commit=False)
            medical_exams_form.save()

            # Saving Consult
            consult.medical_status = True
            consult.save()
            consult_form.save_m2m()

            # Consult Evaluation
            if evaluate_consult(consult):
                generate_pdf('appointments/consult_pdf.html', consult, request.user)
                return JsonResponse({'prescription_path': settings.MEDIA_URL + consult.prescription.name})

            return redirect('appointments:appointments')

        elif not medical_exams_form.is_valid():
            context['error'] = '* Exams not filled correctly. "Type" & "Image" fields must be provided.'

    return render(request, template, context)


def agenda(request):
    """
        DOCSTRING:
        The agenda() view is used to render all the consults that are pending from today's date to the greater date a
        consult was registered, they are also classified by month, this means that no matter if there is only a consult
        scheduled for november, that month will appear in the template, we will also render the AgendaFilterForm, this
        so that we can perform filtering processes with the data we have at our disposal in the agenda, we need to render
        the name of the months our consults are scheduled, for this we store the result returned from our collect_months_names()
        function into a variable called 'months_names', along with the filtering form and the consults,this function will also verify that
        there is a 'page' parameter in the request.GET dict, if there is no parameter, then the first page is shown, else the
        asking page will be shown to the user. This function takes only one argument: 'request' which expects a request object.
    """
    today = timezone.localtime()
    tzone = timezone.get_current_timezone()
    appointments_list = Consult.objects.filter(created_by=request.user, datetime__date__gte=today.date(), medical_status=False).order_by('datetime')
    months_names = collect_months_names(appointments_list, tzone)
    form = AgendaDateFilterForm
    template = 'appointments/agenda.html'
    context = {'appointments': appointments_list, 'months': months_names, 'form': form, 'today': today}
    return render(request, template, context)


def filter_agenda(request):
    """
        This filter_agenda is used to filter the consults belonging to this user, depending on the parameters values inside the
        request.GET dictionary, this function will collect the 'date_from' parameter and 'date_to' parameter values and convert
        them into a datetime object, this way we can filter the consults based on this values, finally we will return our response
        in JSON Format, this function also checks if the 'page' parameter is inside the querystring, if it is, then the page that
        will be rendered will be that one in the 'page' value, else the first page will be rendered.
    """
    tzone = timezone.get_current_timezone()
    template = 'appointments/partial_agenda_list.html'
    query_date_from = datetime.strptime(request.GET.get('date_from'), "%Y-%m-%d")
    query_date_to = datetime.strptime(request.GET.get('date_to'), "%Y-%m-%d")
    consults_list = Consult.objects.filter(datetime__date__gte=query_date_from, datetime__date__lte=query_date_to, created_by=request.user).order_by('datetime')
    months = collect_months_names(consults_list, tzone)
    context = {'appointments': consults_list, 'months': months}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def appointment_date_update(request, pk):
    """
        DOCSTRING:
        This appointment_date_update() view is used to update the date of a specific consult, this view will collect that
        specific consult form the database and the ConsultsForm, since this process will be done asynchronously, we need
        to return our response in JSON Format, for this we use our render_to_string function, if the request.method is
        'GET' we return this response in JSON Format, if the request.method is 'POST' we fill our form with the
        content inside our request.POST dict and check if it is valid or not, if it is not then we will add a custom
        error and return the response again, if it is we save this consult's new date and return in JSON Format the
        updated content, so the registers will be updated asynchronously in the front-end. It takes two arguments,
        'request' which expects a request object and 'pk' which expects a consult.pk key.
    """
    today = timezone.localtime()
    tzone = timezone.get_current_timezone()
    consult = Consult.objects.get(pk=pk)
    form = AgendaDateFilterForm
    consult_form = ConsultForm(request.POST or None, instance=consult, user=request.user)
    template = 'appointments/appointment_date_update.html'
    context = {'consult_form': consult_form, 'consult':consult}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        consult_form = ConsultForm(request.POST or None, instance=consult, user=request.user)
        if consult_form.is_valid():
            try:
                consult_form.save()
                loop.run_until_complete(send_sms(consult))
                consults_list = Consult.objects.filter(created_by=request.user, datetime__date__gte=today.date(), medical_status=False).order_by('datetime')
                months_names = collect_months_names(consults_list, tzone)
                data = {'updated_html': render_to_string('appointments/partial_agenda_list.html', {'appointments': consults_list, 'months': months_names, 'form': form}, request=request)}
            except IntegrityError:
                date = consult_form.cleaned_data.get('datetime').date()
                time = consult_form.cleaned_data.get('datetime').time().strftime('%I:%M:%S %p')
                context['error'] = 'There is already a reservation for {} at {}'.format(date, time)
                data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def confirm_appointment(request, pk):
    """
        DOCSTRING:
        This confirm_appointment() view is used to confirm the consult, it will set the consult.status attribute from pending
        to confirmed, once the consult is confirmed, it will collect all the updated data from the database and return
        it in a JSON Response, since the agenda will be updated asynchronously.It takes two arguments,
        'request' which expects a request object and 'pk' which expects a consult.pk key.
    """
    consult = Consult.objects.get(pk=pk)
    consult.status = 'CONFIRMED'
    consult.save()
    today = timezone.localtime()
    tzone = timezone.get_current_timezone()
    form = AgendaDateFilterForm
    consults_list = Consult.objects.filter(created_by=request.user, datetime__date__gte=today.date(), medical_status=False).order_by('datetime')
    months_names = collect_months_names(consults_list, tzone)
    data = {'html': render_to_string('appointments/partial_agenda_list.html', {'appointments': consults_list, 'months': months_names, 'form': form}, request=request)}
    return JsonResponse(data)


def cancel_appointment(request, pk):
    """
        DOCSTRING:
        The cancel_appointment() view is used to cancel any consult if needed, since this process will be done from the
        Agenda view, then we need to return the response in a JSON Format, for this we will make use of our render_to_
        string function and return the rendered template as a string, if the request.method is 'GET' then the template
        will be rendered as a form with the information of that consult, if the request.method is 'POST' then the consult
        will be cancelled, setting the status attribute to 'CANCELLED' and saved. Since we need to update the Agenda
        with the updated consults, we will collect them form the DB with the new data, and return it through a JSON
        response object. The agenda is divided into months, so we need to collect all the months in which there are
        consults pending for us, how can we do that? We call our collected_months function and we pass the updated_consults
        and tzone as parameters, finally we send our response in JSON Format so the agenda view can update this data.
    """
    today = timezone.localtime(timezone.now())
    consult = Consult.objects.get(pk=pk)
    tzone = timezone.get_current_timezone()
    form = AgendaDateFilterForm
    template = 'appointments/cancel_appointment.html'
    context = {'consult': consult}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        consult.status = 'CANCELLED'
        consult.save()
        appointments_list = Consult.objects.filter(created_by=request.user, datetime__date__gte=today.date(), medical_status=False).order_by('datetime')
        months_names = collect_months_names(appointments_list, tzone)
        data = {'html': render_to_string('appointments/partial_agenda_list.html', {'appointments': appointments_list, 'months': months_names, 'form':form}, request=request)}
    return JsonResponse(data)


def registers(request):
    """
        DOCSTRING:
        The registers() view is used to display all the appointments that have been scheduled, no matter if they were
        attended or not, they will always be displayed anyways, here you can see if they were never attended, cancelled,
        confirmed or updated. This consult will also call the 'check_delayed_consults' to close all the consults that were
        not attended the day before or days before the current date. If the request.method is 'GET' it will return all 
        the appointments along with the filtering form, if the request.method is 'POST' then the filtering will be processed
        and if the filters were changed, it will perform the filtering, else it will return a custom error, as well if the
        filtering did not found any matches. The registers page will be updated asynchronously, so we will need to return
        these values in JSON Format. It takes a single argument: 'request' and expects a request object.
    """
    loop.run_until_complete(check_delayed_consults(request.user))
    today = timezone.localtime()
    consults_list = Consult.objects.filter(created_by=request.user).order_by('-datetime')
    template = 'appointments/registers.html'
    form = RegisterFilterForm
    context = {'registers': consults_list, 'form': form, 'items': len(consults_list), 'today': today}
    return render(request, template, context)


def filter_registers(request):
    """
        This filter_registers() function is used to filter the registers belonging to this user, depending on the parameters values inside the
        request.GET dictionary, this function will collect the 'patient', 'month' and 'year' parameter values and convert
        them into a datetime object, this way we can filter the consults based on this values, finally we will return our response
        in JSON Format, this function also checks if the 'page' parameter is inside the querystring, if it is, then the page that
        will be rendered will be that one in the 'page' value, else the first page will be rendered.
    """
    patient_query = request.GET.get('patient')
    month_query = request.GET.get('month')
    year_query = request.GET.get('year')
    consults_list = filter_conditional_results(request.user, cleaned_data={'patient': patient_query, 'month': month_query, 'year': year_query}).order_by('datetime')
    context = {'registers': consults_list}
    data = {'html': render_to_string('appointments/partial_registers.html', context, request)}
    return JsonResponse(data)
