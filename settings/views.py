"""
    This views.py file contains all the function definitions needed for the settings app to work properly, it is composed
    of # views, and divided in # sections: settings, account, insurance, allergies and drugs.
"""

# Imports

from meditracker.settings import STATIC_URL

from django.apps import apps
from django.db.models import Q
from django.shortcuts import render
from django.http import JsonResponse
from django.db import IntegrityError
from django.template.loader import render_to_string
from patients.forms import AllergyFilterForm, AllergyForm, InsuranceCarrierFilterForm, InsuranceCarrierForm
from appointments.forms import DrugForm, DrugFilterForm, MedicalTestForm, MedicalTestFilterForm, VaccineCreationAndUpdateForm, VaccineApplicationCreationAndUpdateForm, VaccineFilterForm
from accounts.forms import MailingCredentialForm, ChangeAvailabilityForm, AddLinkingForm, UserAccountSettingsForm, UserGeneralSettingsForm
User = apps.get_model('accounts', 'CustomUser')
Doctor = apps.get_model('accounts', 'Doctor')
Assistant = apps.get_model('accounts', 'Assistant')
Patient = apps.get_model('patients', 'Patient')
MailingCredential = apps.get_model('accounts', 'MailingCredential')
InsuranceCarrier = apps.get_model('patients', 'InsuranceCarrier')
Drugs = apps.get_model('appointments', 'Drug')
Allergies = apps.get_model('patients', 'Allergy')
MedicalTest = apps.get_model('appointments', 'MedicalTest')
Vaccine = apps.get_model('appointments', 'Vaccine')


# Create your views here.

# Settings
############################


def settings(request):
    """
        DOCSTRING:
        This settings views is used to display the settings main page, it receives one argument: 'request' and expects
        a request object.
    """
    template = 'settings/settings.html'
    return render(request, template)


# General
##############################

def general(request):
    """
        DOCSTRING:
        This general view is used to present the general settings, this content will be displayed in the settings dynamically,
        so the content will sent to the front-end in JSON format, we will use the render_to_string function to convert a content
        into a string and send it using the JsonResponse class. It expects one single argument: 'request', it expects a
        request object.
    """
    template = 'settings/general.html'
    data = {'html': render_to_string(template, request=request)}
    return JsonResponse(data)


def change_wallpaper(request):
    """
        DOCSTRING:
        This change_wallpaper view is used to display the background wallpaper of the user, this view will send the
        UserSettingsForm with the account model belonging to the user as an instance if the request's method is a GET,
        if the method is a POST, then the form will be filled with the request data and check if it's valid if the data
        is valid, then a success response will be sent as JSON Response.
    """
    if request.method == 'POST':
        form = UserGeneralSettingsForm(request.POST, instance=request.user.general_settings)
        if form.is_valid():
            form.save()
            return JsonResponse({'response': 'success'})
    form = UserGeneralSettingsForm(instance=request.user.general_settings)
    template = 'settings/change_wallpaper.html'
    context = {'form': form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def toggle_sfx(request):
    if request.method == 'POST':
        form = UserGeneralSettingsForm(request.POST, instance=request.user.general_settings)
        if form.is_valid():
            form.save()
            return JsonResponse({'response': 'success'})
    form = UserGeneralSettingsForm(instance=request.user.general_settings)
    template = 'settings/toggle_sfx.html'
    context = {'form': form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def toggle_notifications(request):
    if request.method == 'POST':
        form = UserGeneralSettingsForm(request.POST, instance=request.user.general_settings)
        if form.is_valid():
            form.save()
            return JsonResponse({'response': 'success'})
    form = UserGeneralSettingsForm(instance=request.user.general_settings)
    template = 'settings/toggle_notifications.html'
    context = {'form': form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)

# Profile
#############################


def profile(request):
    """
        DOCSTRING:
        This profile view is used to present the profile settings, this content will be displayed in the settings dynamically,
        so the content will sent to the front-end in JSON format, we will use the render_to_string function to convert a content
        into a string and send it using the JsonResponse class. It expects one single argument: 'request', it expects a
        request object.
    """
    template = 'settings/profile.html'
    data = {'html': render_to_string(template, {}, request)}
    return JsonResponse(data)


def change_availability(request):
    """
        DOCSTRING:
        This change_availability view is used to display the user status, this view will send the ChangeAvailabilityForm
        with the UserProfile model belonging to the user as an instance if the request's method is a GET, if the method
        is a POST, then the form will be filled with the request data and check if it's valid and updated.
    """
    if request.method == 'POST':
        form = ChangeAvailabilityForm(request.POST, instance=request.user.profile)
        if form.is_valid():
            form.save()
    template = 'settings/change_availability.html'
    form = ChangeAvailabilityForm(instance=request.user.profile)
    context = {'form': form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)

# Accounts
##############################


def account(request):
    """
        DOCSTRING:
        This account view is used to present the account settings, this content will be displayed in the settings dynamically,
        so the content will sent to the front-end in JSON format, we will use the render_to_string function to convert a content
        into a string and send it using the JsonResponse class. It expects one single argument: 'request', it expects a
        request object.
    """
    context = {}
    template = 'settings/account.html'

    if request.user.roll == 'DOCTOR':
        subscription = request.user.doctor.get_subscription_display()
        if subscription == 'Basic':
            action = 'upgrade'
            action_message = 'GO Premium'
        else:
            action = 'downgrade'
            action_message = 'Cancel Premium'
        context['subscription'] = subscription
        context['action'] = action
        context['action_message'] = action_message

    form = UserAccountSettingsForm(instance=request.user.account_settings)
    context['user_settings_form'] = form
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def update_user_session_expiry_time(request):
    if request.method == "POST":
        form = UserAccountSettingsForm(request.POST, instance=request.user.account_settings)
        if form.is_valid():
            form.save()
        data = {'Success': 'Session Expiry Time has been changed successfully'}
        return JsonResponse(data)


# Linking
###############################

def linking(request):
    """
        DOCSTRING: This view is used to display the links between doctors and assitants
    """
    if request.user.roll == 'DOCTOR':
        links = Assistant.objects.filter(doctors__in=[request.user])
    else:
        links = request.user.assistant.doctors.all()
    template = 'settings/linkings.html'
    data = {'html': render_to_string(template, request=request, context={'links': links})}
    return JsonResponse(data)


def add_linking(request):
    """
        DOCSTRING: The add_linking view is used by the assistant user to add a linking between itself and a doctor account,
        this view accepts a request object, based on what method the request was made, a different operation will occur,
        if the method id GET then we will render the add_linking form, we will send it in JSON format to be displayed
        async in the front-end, if the method is POST, we will collect the linking id and search if there are any doctor's
        who own this id, finally the link will be created.
    """
    linking_form = AddLinkingForm
    template = 'settings/create_linking.html'
    context = {'linking_form': linking_form}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        linking_id = request.POST.get('linking_id')
        try:
            doctor = Doctor.objects.get(linking_id=linking_id)
            message = None
            subscription = doctor.doctor.subscription
            total_linkings = len(Assistant.objects.filter(doctors__in=[doctor]))

            if subscription == 'BASIC' and total_linkings == 1:
                message = 'The user you are tying to get linked to is using a Sealena Basic account and is already linked' \
                          'to an Assistant account, in order to get linked the user must switch to a Premium Account following ' \
                          'the next path (Settings > Account > Go Premium)'
                context = {'message': message}
                data = {'warning': render_to_string(template, context, request)}

            else:
                request.user.assistant.doctors.add(doctor)
                links = request.user.assistant.doctors.all()
                template = 'settings/linkings.html'
                data = {'updated_html': render_to_string(template, request=request, context={'links': links})}

        except Doctor.DoesNotExist:
            context['error'] = 'The linking ID provided does not belong to any entity'
            data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def remove_linking(request, pk):
    """
        DOCSTRING: This remove_linking view is used to remove linkings between doctors and assistants, it receives a
        request object and a pk used to identify the doctor or assistant that will be removed from the linkings.
    """
    user = User.objects.get(pk=pk)
    if request.method == 'POST':
        if request.user.roll == 'DOCTOR':
            user.assistant.doctors.remove(request.user)
            links = Assistant.objects.filter(doctors__in=[request.user])
        else:
            request.user.assistant.doctors.remove(user)
            links = request.user.assistant.doctors.all()
        data = {'updated_html': render_to_string(template_name='settings/linkings.html', request=request, context={'links':links})}
        return JsonResponse(data)

    template = 'settings/remove_linking.html'
    data = {'html': render_to_string(template, request=request, context={'user': user})}
    return JsonResponse(data)

# Mailing
###############################


def mailing(request):
    """
        DOCSTRING:
        This mailing view is used to present the mailing settings, this content will be displayed in the settings dynamically,
        so the content will sent to the front-end in JSON format, we will use the render_to_string function to convert a content
        into a string and send it using the JsonResponse class. It expects one single argument: 'request', it expects a
        request object.
    """
    mailing_form = MailingCredentialForm(instance=MailingCredential.objects.get(user=request.user))
    template = 'settings/mailing.html'
    context = {'mailing_form': mailing_form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def update_mailing_information(request):
    """
        DOCSTRING:
        This update_mailing_information view is used to update the mailing information of the current user, once this
        view receives a request with a POST content, the information will be updated and sent to the client side in a
        JSON Format.
    """
    template = 'settings/mailing.html'
    if request.method == "POST":
        mailing_info = MailingCredentialForm(request.POST, instance=MailingCredential.objects.get(user=request.user))
        if mailing_info.is_valid():
            mailing_info.save()
            mailing_form = MailingCredentialForm(instance=MailingCredential.objects.get(user=request.user))
            context = {'mailing_form': mailing_form, 'success': True}
            data = {'html': render_to_string(template, context, request)}
            return JsonResponse(data)

# Medical Testing Logic
#####################################


def medical_testing_list(request):
    """
        DOCSTRING:
        This medical_testing_list view is used to display the list of all the medical tests created and available for this user,
        the content of this view will be displayed async in the front end so we must send our data im Json Format, for
        this we will make use of our render_to_string function, if the request.method is 'GET' then we will send our
        content through a JsonResponse, if the request.method is 'POST', then we will fill our MedicalTestFilterForm
        with our request.POST dict content, and proceed the filtering with the value inside the 'company' key, when our
        query is set, we send it to the client side as a JSON Response. This view is passed a single argument: 'request',
        which expects a request object.
    """
    page = request.GET.get('page')
    medical_test_list = MedicalTest.objects.filter(created_by=request.user).order_by('name')
    medical_test_filter_form = MedicalTestFilterForm
    template = 'settings/medical_tests_partial_list.html' if page else 'settings/medical_testing.html'
    context = {'medical_tests': medical_test_list, 'form': medical_test_filter_form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def filter_medical_testing(request):
    """
        DOCSTRING:
        This filter_medical_testing view is used to filter the results of the available medical tests for the user, this view
        will perform the filtering and will return the data collected based on a query made by the user, this query
        will be extracted from the 'HTTP_QUERY' inside the request.META dictionary, the results will be sent to the
        client side in JSON Format for dynamic displaying, so for this we will make use of the render_to_string function,
        this way we can convert, our response with sent as a JsonResponse. This view accepts one single argument, the
        'request' which expects a request object.
    """
    query = request.GET.get('query')
    updated_medical_tests = MedicalTest.objects.filter(name__icontains=query, created_by=request.user).order_by('name')
    template = 'settings/medical_tests_partial_list.html'
    context = {'medical_tests': updated_medical_tests}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def medical_test_type_filter(request):
    """
        DOCSTRING:
        This medical_test_type_filter view is used to filter the select options inside our appointments update view, this view
        will only receive "GET" requests and will return a querySet depending on the 'type' value inside the 'type'
        key inside the request.GET dictionary, if the key is empty, then it will return a querySet with all the tests
        available for this user.
    """
    if request.method == 'GET':
        test_type = request.GET.get('test_type')
        if test_type != '':
            medical_tests = MedicalTest.objects.filter(created_by=request.user, test_type=test_type).order_by('name')
        else:
            medical_tests = MedicalTest.objects.filter(created_by=request.user).order_by('name')
        data = {'updated_tests': render_to_string('appointments/partial_medical_tests_selection.html', context={'medical_tests': medical_tests}, request=request)}
        return JsonResponse(data)


def add_medical_test(request):
    """
        The add_medical_test view is used to display the medical_test addition form, this form will be displayed async
        in the client side, if the request.method is 'GET' then the content from this view, in this case the form, will
        be sent as a response in JSON Format, we convert the rendered content in the template to a string using the
        render_to_string function, this data will be sent as a JSON Response to the client side, if the request.method
        is 'POST' then the form will be filled with the request.POST content inside our dictionary, will be evaluated,
        and if the response is valid, will be saved and the updated list will be sent as a JSON Response, if the form is
        invalid, a custom error will be the response, this view expects one single arguments: 'requests' a single object.
    """
    medical_test_form = MedicalTestForm
    context = {'medical_test_form': medical_test_form}
    template = 'settings/medical_test_add.html'
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        medical_test_form = MedicalTestForm(request.POST)
        if medical_test_form.is_valid():
            try:
                medical_test = medical_test_form.save(commit=False)
                medical_test.created_by = request.user
                medical_test.save()
                updated_medical_test = MedicalTest.objects.filter(created_by=request.user).order_by('name')
                context = {'medical_tests': updated_medical_test, 'form': MedicalTestFilterForm}
                # How to return an error from the backend to the frontend?
                data = {'updated_html': render_to_string('settings/medical_testing.html', context, request), 'updated_tests_list': render_to_string('appointments/partial_medical_tests_selection.html', context=context, request=request)}
            except IntegrityError:
                context['error'] = 'Medical Test already listed in your options'
                data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def medical_test_details(request, pk):
    """
        DOCSTRING:
        This medical_test_details views is used to display the information of a particular medical test, this information
        will be displayed async in the client side, so our content must be sent in JSON Format, for this we will make use
        of our render_to_string function and send this string as a JsonResponse. This view requires two arguments,
        'request' which expects a request object and 'pk' which expects a pk of a particular insurance.
    """
    medical_test = MedicalTest.objects.get(pk=pk)
    template = 'settings/medical_test_details.html'
    context = {'medical_test': medical_test}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def update_medical_test(request, pk):
    """
        DOCSTRING:
        This update_medical_test view is used to update any medical test instance, the form used to update the instances will
        be displayed async in the client side, so the content must be sent in JSON Format, for this we make use of
        our render_to_string function to convert into a string the rendered template, if the request.method is 'GET', then
        this form will be sent to the client side as a JsonResponse object, if the request.method is a 'POST' then the form
        will be populated with the content inside our request.POST dictionary, we will evaluate this form, if the form is
        valid then the medical test instance will be updated, if not a custom error will be sent instead. This view requires
        two arguments: 'request' which expects request object, and 'pk' which expects an insurance pk of a particular test
     instance.
    """
    medical_test = MedicalTest.objects.get(pk=pk)
    medical_test_form = MedicalTestForm(request.POST or None, instance=medical_test)
    template = 'settings/medical_test_update.html'
    context = {'medical_test_form': medical_test_form, 'medical_test':medical_test}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        medical_test_form = MedicalTestForm(request.POST or None, instance=medical_test)
        if medical_test_form.is_valid():
            try:
                medical_test_form.save()
                updated_medical_tests = MedicalTest.objects.filter(created_by=request.user).order_by('name')
                context = {'medical_tests': updated_medical_tests, 'form': MedicalTestForm}
                data = {'updated_html': render_to_string('settings/medical_testing.html', context, request)}
            except IntegrityError:
                context['error'] = 'Medical Test already listed in your options'
                data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def delete_medical_test(request, pk):
    """
        DOCSTRING:
        This delete_medical_test view is used to delete any test instances, the form to delete the test instance
        will be displayed async in the client side, for this we will make use of our render_to_string function to
        convert our content into a string, if the request.method is a 'GET' then the content will be sent as a Json-
        Response, if the request.method is 'POST' then the instance will be deleted automatically.
    """
    medical_test = MedicalTest.objects.get(pk=pk)
    context = {'medical_test': medical_test}
    template = 'settings/medical_test_delete.html'
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        if not medical_test.operative(request.user):
            medical_test.delete()
            updated_medical_tests = MedicalTest.objects.filter(created_by=request.user).order_by('name')
            context = {'medical_tests': updated_medical_tests, 'form': MedicalTestForm}
            data = {'updated_html': render_to_string('settings/medical_testing.html', context, request)}
        else:
            context = {'error': "Medical Test linked to some registers, deletion prohibited"}
            data = {'error': render_to_string(template, context, request)}
    return JsonResponse(data)

# Insurances Logic
#####################################


def insurance_list(request):
    """
        DOCSTRING:
        This insurance_list view is used to display the list of all the insurances created and available for this user,
        the content of this view will be displayed async int eh front end so we must send our data im Json Format, for
        this we will make use of our render_to_string function, if the request.method is 'GET' then we will send our
        content through a JsonResponse, if the request.method is 'POST', then we will fill our InsuranceCarrierFilterForm
        with our request.POST dict content, and proceed the filtering with the value inside the 'company' key, when our
        query is set, we send it to the client side as a JSON Response. This view is passed a single argument: 'request',
        which expects a request object.
    """
    insurances_list = InsuranceCarrier.objects.filter(created_by=request.user).order_by('company')
    insurance_filter_form = InsuranceCarrierFilterForm
    template = 'settings/insurance_list.html'
    context = {'insurances': insurances_list, 'form': insurance_filter_form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def filter_insurance(request):
    """
        DOCSTRING:
        This filter_insurance view is used to filter the results of the available insurances for the user, this view
        will perform the filtering and will return the data collected based on a query made by the user, this query
        will be extracted from the 'HTTP_QUERY' inside the request.META dictionary, the results will be sent to the
        client side in JSON Format for dynamic displaying, so for this we will make use of the render_to_string function,
        this way we can convert, our response with sent as a JsonResponse. This view accepts one single argument, the
        'request' which expects a request object.
    """
    query = request.GET.get('query')
    updated_insurances = InsuranceCarrier.objects.filter(company__icontains=query, created_by=request.user).order_by('company')
    template = 'settings/insurance_partial_list.html'
    context = {'insurances': updated_insurances, 'filtered': True}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def add_insurance_carrier(request):
    """
        The add_insurance_carrier view is used to display the insurance addition form, this form will be displayed async
        in the client side, if the request.method is 'GET' then the content from this view, in this case the form, will
        be sent as a response in JSON Format, we convert the rendered content in the template to a string using the
        render_to_string function, this data will be sent as a JSON Response to the client side, if the request.method
        is 'POST' then the form will be filled with the request.POST content inside our dictionary, will be evaluated,
        and if the response is valid, will be saved and the updated list will be sent as a JSON Response, if the form is
        invalid, a custom error will be the response, this view expects one single arguments: 'requests' a single object.
    """
    insurance_carrier_form = InsuranceCarrierForm
    context = {'insurance_carrier_form': insurance_carrier_form}
    template = 'settings/insurance_add.html'
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        insurance_carrier_form = InsuranceCarrierForm(request.POST)
        if insurance_carrier_form.is_valid():
            try:
                insurance = insurance_carrier_form.save(commit=False)
                insurance.created_by = request.user
                insurance.save()
                updated_insurances = InsuranceCarrier.objects.filter(created_by=request.user).order_by('company')
                context = {'insurances': updated_insurances, 'form': InsuranceCarrierFilterForm}
                data = {'updated_html': render_to_string('settings/insurance_list.html', context, request), 'updated_selections': render_to_string('settings/insurance_partial_select.html', context=context, request=request)}
            except IntegrityError:
                context['error'] = 'Insurance already listed in your options'
                data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def insurance_details(request, pk):
    """
        DOCSTRING:
        This insurance_details views is used to display the information of a particular insurance carrier, this information
        will be displayed async in the client side, so our content must be sent in JSON Format, for this we will make use
        of our render_to_string function and send this string as a JsonResponse. This view requires two arguments,
        'request' which expects a request object and 'pk' which expects a pk of a particular insurance.
    """
    carrier = InsuranceCarrier.objects.get(pk=pk)
    template = 'settings/insurance_details.html'
    context = {'insurance': carrier}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def update_insurance(request, pk):
    """
        DOCSTRING:
        This insurance_update view is used to update any insurance instance, the form used to update the instances will
        be displayed async in the client side, so the content must be sent in JSON Format, for this we make use of
        our render_to_string function to convert into a string the rendered template, if the request.method is 'GET', then
        this form will be sent to the client side as a JsonResponse object, if the request.method is a 'POST' then the form
        will be populated with the content inside our request.POST dictionary, we will evalute this form, if the form is
        valid then the insurance instance will be updated, if not a custom error will be sent instead. This view requires
        two arguments: 'request' which expects request object, and 'pk' which expects an insurance pk of a particular in-
        surance instance.
    """
    carrier = InsuranceCarrier.objects.get(pk=pk)
    insurance_form = InsuranceCarrierForm(request.POST or None, instance=carrier)
    template = 'settings/insurance_update.html'
    context = {'insurance': insurance_form, 'carrier': carrier}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        insurance_form = InsuranceCarrierForm(request.POST or None, instance=carrier)
        if insurance_form.is_valid():
            try:
                # Why do i need to provide again the user?
                insurance_form.save()
                updated_insurances = InsuranceCarrier.objects.filter(created_by=request.user).order_by('company')
                context = {'insurances': updated_insurances, 'form': InsuranceCarrierFilterForm}
                # How to return an error from the backend to the frontend?
                data = {'updated_html': render_to_string('settings/insurance_list.html', context, request)}
            except IntegrityError:
                context['error'] = 'Insurance already listed in your options'
                data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def delete_insurance(request, pk):
    """
        DOCSTRING:
        This insurance_delete view is used to delete any insurance instances, the form to delete the insurance instance
        will be displayed async in the client side, for this we will make use of our render_to_string function to
        convert our content into a string, if the request.method is a 'GET' then the content will be sent as a Json-
        Response, if the request.method is 'POST' then the instance will be deleted automatically.
    """
    carrier = InsuranceCarrier.objects.get(pk=pk)
    context = {'insurance': carrier}
    template = 'settings/insurance_delete.html'
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        if not carrier.operative(request.user):
            carrier.delete()
            updated_insurances = InsuranceCarrier.objects.filter(created_by=request.user).order_by('company')
            context = {'insurances': updated_insurances, 'form': InsuranceCarrierFilterForm}
            data = {'updated_html': render_to_string('settings/insurance_list.html', context, request)}
        else:
            context = {'error': "Carrier linked to some registers, deletion prohibited"}
            data = {'error': render_to_string(template, context, request)}
    return JsonResponse(data)


# Allergies Logic
##################################


def allergy_list(request):
    """
        DOCSTRING:
        This allergies view is used to display the list of all the allergies created and available for this user,
        the content of this view will be displayed async int eh front end so we must send our data im Json Format, for
        this we will make use of our render_to_string function, if the request.method is 'GET' then we will send our
        content through a JsonResponse, if the request.method is 'POST', then we will fill our AllergiesFilterForm
        with our request.POST dict content, and proceed the filtering with the value inside the 'allergy_type' key, when our
        query is set, we send it to the client side as a JSON Response. This view is passed a single argument: 'request',
        which expects a request object.
    """
    allergies_list = Allergies.objects.filter(created_by=request.user).order_by('allergy_type')
    filter_form = AllergyFilterForm
    template = 'settings/allergies_list.html'
    context = {'allergies': allergies_list, 'form': filter_form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def filter_allergies(request):
    """
        DOCSTRING:
        This filter_allergies view is used to filter the results of the available allergies for the user, this view
        will perform the filtering and will return the data collected based on a query made by the user, this query
        will be extracted from the 'HTTP_QUERY' inside the request.META dictionary, the results will be sent to the
        client side in JSON Format for dynamic displaying, so for this we will make use of the render_to_string function,
        this way we can convert, our response with sent as a JsonResponse. This view accepts one single argument, the
        'request' which expects a request object.
    """
    query = request.GET.get('query')
    filtered_allergies = Allergies.objects.filter(allergy_type__icontains=query, created_by=request.user).order_by('allergy_type')
    template = 'settings/allergies_partial_list.html'
    context = {'allergies': filtered_allergies, 'filtered': True}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def add_allergy(request):
    """
        The allergies_create view is used to display the allergy addition form, this form will be displayed async
        in the client side, if the request.method is 'GET' then the content from this view, in this case the form, will
        be sent as a response in JSON Format, we convert the rendered content in the template to a string using the
        render_to_string function, this data will be sent as a JSON Response to the client side, if the request.method
        is 'POST' then the form will be filled with the request.POST content inside our dictionary, will be evaluated,
        and if the response is valid, will be saved and the updated list will be sent as a JSON Response, if the form is
        invalid, a custom error will be the response, this view expects one single arguments: 'requests' a single object.
    """
    allergies_form = AllergyForm
    template = 'settings/add_allergies.html'
    context = {'allergies_form': allergies_form}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        allergies_form = AllergyForm(request.POST)
        if allergies_form.is_valid():
            try:
                allergy = allergies_form.save(commit=False)
                allergy.created_by = request.user
                allergy.save()
                allergies_list = Allergies.objects.filter(created_by=request.user).order_by('allergy_type')
                context = {'allergies': allergies_list, 'allergy': allergy,'form': AllergyFilterForm}
                data = {'updated_html': render_to_string('settings/allergies_list.html', context, request), 'updated_selections': render_to_string('settings/allergies_partial_select.html', context=context, request=request)}
            except IntegrityError:
                context['error'] = 'Allergy is already listed in your options'
                data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def update_allergy(request, pk):
    """
        DOCSTRING:
        This allergies_update view is used to update any allergy instance, the form used to update the instances will
        be displayed async in the client side, so the content must be sent in JSON Format, for this we make use of
        our render_to_string function to convert into a string the rendered template, if the request.method is 'GET', then
        this form will be sent to the client side as a JsonResponse object, if the request.method is a 'POST' then the form
        will be populated with the content inside our request.POST dictionary, we will evalute this form, if the form is
        valid then the allergy instance will be updated, if not a custom error will be sent instead. This view requires
        two arguments: 'request' which expects request object, and 'pk' which expects an allergy pk of a particular allergy
        instance.
    """
    allergy = Allergies.objects.get(pk=pk)
    template = 'settings/update_allergy.html'
    allergy_form = AllergyForm(request.POST or None, instance=allergy)
    context = {'allergy': allergy, 'allergy_form': allergy_form}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        allergy_form = AllergyForm(request.POST or None, instance=allergy)
        if allergy_form.is_valid():
            try:
                allergy = allergy_form.save(commit=False)
                allergy.created_by = request.user
                allergy.save()
                allergies_list = Allergies.objects.filter(created_by=request.user).order_by('allergy_type')
                context = {'allergies': allergies_list, 'form': AllergyFilterForm}
                data = {'updated_html': render_to_string('settings/allergies_list.html', context, request)}
            except IntegrityError:
                context['error'] = 'Allergy is already listed in your options'
                data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def allergy_details(request, pk):
    """
        DOCSTRING:
        This allergies_details views is used to display the information of a particular allergy, this information
        will be displayed async in the client side, so our content must be sent in JSON Format, for this we will make use
        of our render_to_string function and send this string as a JsonResponse. This view requires two arguments,
        'request' which expects a request object and 'pk' which expects a pk of a particular insurance.
    """
    allergy = Allergies.objects.get(pk=pk)
    template = 'settings/allergy_details.html'
    context = {'allergy': allergy}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def delete_allergy(request, pk):
    """
        DOCSTRING:
        This allergies_delete view is used to delete any allergies instances, the form to delete the allergy instance
        will be displayed async in the client side, for this we will make use of our render_to_string function to
        convert our content into a string, if the request.method is a 'GET' then the content will be sent as a Json-
        Response, if the request.method is 'POST' then the instance will be deleted automatically.
    """
    allergy = Allergies.objects.get(pk=pk)
    template = 'settings/allergy_delete.html'
    context = {'allergy': allergy}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        if not allergy.operative(request.user):
            allergy.delete()
            allergies_list = Allergies.objects.filter(created_by=request.user).order_by('allergy_type')
            context = {'allergies': allergies_list, 'form': AllergyFilterForm}
            data = {'updated_html': render_to_string('settings/allergies_list.html', context, request)}
        else:
            context = {'error': 'Allergy linked to some registers, deletion prohibited'}
            data = {'error': render_to_string(template, context, request)}
    return JsonResponse(data)


# Drugs Logic
###############################


def drug_list(request):
    """
        DOCSTRING:
        This drugs_list view is used to display the list of all the drugs created and available for this user,
        the content of this view will be displayed async int eh front end so we must send our data im Json Format, for
        this we will make use of our render_to_string function, if the request.method is 'GET' then we will send our
        content through a JsonResponse, if the request.method is 'POST', then we will fill our DrugsFilterForm
        with our request.POST dict content, and proceed the filtering with the value inside the 'name' key, when our
        query is set, we send it to the client side as a JSON Response. This view is passed a single argument: 'request',
        which expects a request object.
    """
    drugs_list = Drugs.objects.filter(created_by=request.user).order_by('name')
    template = 'settings/drugs_list.html'
    context = {'drugs': drugs_list, 'form': DrugFilterForm}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def filter_drugs(request):
    """
        DOCSTRING:
        This filter_drugs view is used to filter the results of the available drugs for the user, this view
        will perform the filtering and will return the data collected based on a query made by the user, this query
        will be extracted from the 'HTTP_QUERY' inside the request.META dictionary, the results will be sent to the
        client side in JSON Format for dynamic displaying, so for this we will make use of the render_to_string function,
        this way we can convert, our response with sent as a JsonResponse. This view accepts one single argument, the
        'request' which expects a request object.
    """
    query = request.GET.get('query')
    filtered_drugs = Drugs.objects.filter(name__icontains=query, created_by=request.user).order_by('name')
    template = 'settings/drugs_partial_list.html'
    context = {'drugs': filtered_drugs, 'filtered': True}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def drug_category_filter(request):
    """
        DOCSTRING:
        This drug_category_filter view is used to filter the select options inside our appointments update view, this view
        will only receive "GET" requests and will return a querySet depending on the 'category' value inside the 'category'
        key inside the request.GET dictionary, if the key is empty, then it will return a querySet with all the drugs
        available for this user.
    """
    if request.method == 'GET':
        category = request.GET.get('category')
        if category != '':
            drugs = Drugs.objects.filter(created_by=request.user, category=category).order_by('name')
        else:
            drugs = Drugs.objects.filter(created_by=request.user).order_by('name')
        data = {'updated_drugs': render_to_string('appointments/partial_drugs_selection.html', context={'drugs': drugs}, request=request)}
        return JsonResponse(data)


def add_drug(request):
    """
        The create_drug view is used to display the drug addition form, this form will be displayed async
        in the client side, if the request.method is 'GET' then the content from this view, in this case the form, will
        be sent as a response in JSON Format, we convert the rendered content in the template to a string using the
        render_to_string function, this data will be sent as a JSON Response to the client side, if the request.method
        is 'POST' then the form will be filled with the request.POST content inside our dictionary, will be evaluated,
        and if the response is valid, will be saved and the updated list will be sent as a JSON Response, if the form is
        invalid, a custom error will be the response, this view expects one single arguments: 'requests' a single object.
    """
    drugs_form = DrugForm
    template = 'settings/create_drug.html'
    context = {'form': drugs_form}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        drugs_form = DrugForm(request.POST)
        if drugs_form.is_valid():
            try:
                drug = drugs_form.save(commit=False)
                drug.created_by = request.user
                drug.save()
                drugs_list = Drugs.objects.filter(created_by=request.user).order_by('name')
                context = {'drugs': drugs_list, 'form': DrugFilterForm}
                data = {'updated_html': render_to_string('settings/drugs_list.html', context, request), 'updated_drugs_list': render_to_string('appointments/partial_drugs_selection.html', {'drugs': drugs_list}, request)}
            except IntegrityError:
                context['error'] = 'Drug already listed in your options'
                data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def drug_details(request, pk):
    """
        DOCSTRING:
        This drug_details views is used to display the information of a particular drug, this information
        will be displayed async in the client side, so our content must be sent in JSON Format, for this we will make use
        of our render_to_string function and send this string as a JsonResponse. This view requires two arguments,
        'request' which expects a request object and 'pk' which expects a pk of a particular insurance.
    """
    drug = Drugs.objects.get(pk=pk)
    template = 'settings/drug_details.html'
    context = {'drug': drug}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def update_drug(request, pk):
    """
        DOCSTRING:
        This update_drug view is used to update any drug instance, the form used to update the instances will
        be displayed async in the client side, so the content must be sent in JSON Format, for this we make use of
        our render_to_string function to convert into a string the rendered template, if the request.method is 'GET', then
        this form will be sent to the client side as a JsonResponse object, if the request.method is a 'POST' then the form
        will be populated with the content inside our request.POST dictionary, we will evalute this form, if the form is
        valid then the drug instance will be updated, if not a custom error will be sent instead. This view requires
        two arguments: 'request' which expects request object, and 'pk' which expects an drug pk of a particular drug
        instance.
    """
    drug = Drugs.objects.get(pk=pk)
    drug_form = DrugForm(request.POST or None, instance=drug)
    template = 'settings/update_drug.html'
    context = {'drug': drug, 'form': drug_form}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        drug_form = DrugForm(request.POST or None, instance=drug)
        if drug_form.is_valid():
            try:
                drug = drug_form.save(commit=False)
                drug.created_by = request.user
                drug.save()
                drugs_list = Drugs.objects.filter(created_by=request.user).order_by('name')
                context = {'drugs': drugs_list, 'form': DrugFilterForm}
                data = {'updated_html': render_to_string('settings/drugs_list.html', context, request)}
            except IntegrityError:
                context['error'] = 'Drug already listed in your options'
                data = {'html': render_to_string('settings/update_drug.html', context, request)}
    return JsonResponse(data)


def delete_drug(request, pk):
    """
        DOCSTRING:
        This delete_drug view is used to delete any drug instances, the form to delete the drug instance
        will be displayed async in the client side, for this we will make use of our render_to_string function to
        convert our content into a string, if the request.method is a 'GET' then the content will be sent as a Json-
        Response, if the request.method is 'POST' then the instance will be deleted automatically.
    """
    drug = Drugs.objects.get(pk=pk)
    template = 'settings/delete_drug.html'
    context = {'drug': drug}
    data = {'html': render_to_string(template, context, request)}
    if request.method == 'POST':
        if not drug.operative(request.user):
            drug.delete()
            drugs_list = Drugs.objects.filter(created_by=request.user).order_by('name')
            context = {'drugs': drugs_list, 'form': DrugFilterForm}
            data = {'updated_html': render_to_string('settings/drugs_list.html', context, request)}
        else:
            context = {'error': 'Drug linked to some registers, deletion prohibited'}
            data = {'error': render_to_string(template, context, request)}
    return JsonResponse(data)


# Vaccination Logic
###############################

def vaccines_list(request):
    """
        DOCSTRING:
        This vaccines_list view is used to display the list of all the vaccines created and available for this user,
        the content of this view will be displayed async int eh front end so we must send our data im Json Format, for
        this we will make use of our render_to_string function, if the request.method is 'GET' then we will send our
        content through a JsonResponse, if the request.method is 'POST', then we will fill our DrugsFilterForm
        with our request.POST dict content, and proceed the filtering with the value inside the 'name' key, when our
        query is set, we send it to the client side as a JSON Response. This view is passed a single argument: 'request',
        which expects a request object.
    """
    vaccines = Vaccine.objects.filter(created_by=request.user)
    filter_form = VaccineFilterForm
    template = 'settings/vaccines_list.html'
    context = {'vaccines': vaccines, 'form': filter_form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def filter_vaccines(request):
    """
        DOCSTRING:
        This filter_vaccines view is used to filter the vaccines of the available drugs for the user, this view
        will perform the filtering and will return the data collected based on a query made by the user, this query
        will be extracted from the 'HTTP_QUERY' inside the request.META dictionary, the results will be sent to the
        client side in JSON Format for dynamic displaying, so for this we will make use of the render_to_string function,
        this way we can convert, our response with sent as a JsonResponse. This view accepts one single argument, the
        'request' which expects a request object.
    """
    query = request.GET.get('query')
    vaccines = Vaccine.objects.filter(Q(name__icontains=query) | Q(scientific_name__icontains=query), created_by=request.user)
    template = 'settings/vaccines_partial_list.html'
    context = {'vaccines': vaccines}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def add_vaccine(request, pk=None):
    """
        The add_vaccine view is used to display the vaccine addition form, this form will be displayed async
        in the client side, if the request.method is 'GET' then the content from this view, in this case the form, will
        be sent as a response in JSON Format, we convert the rendered content in the template to a string using the
        render_to_string function, this data will be sent as a JSON Response to the client side, if the request.method
        is 'POST' then the form will be filled with the request.POST content inside our dictionary, will be evaluated,
        and if the response is valid, will be saved and the updated list will be sent as a JSON Response, if the form is
        invalid, a custom error will be the response, this view expects one single arguments: 'requests' a single object.
        This view serves the quick addition of vaccines from patient details and consults.
    """
    form = VaccineCreationAndUpdateForm

    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        patient = None

    if request.method == 'POST':
        form = VaccineCreationAndUpdateForm(request.POST)
        if form.is_valid():
            vaccine = form.save(commit=False)
            vaccine.created_by = request.user
            vaccine.save()

            if 'patients' in request.META['HTTP_REFERER'] or 'appointments' in request.META['HTTP_REFERER']:
                form = VaccineApplicationCreationAndUpdateForm(user=request.user)
                template = 'appointments/add_vaccination_record.html'
                context = {'form': form, 'patient': patient}
                data = {'html': render_to_string(template, context, request)}
                return JsonResponse(data)

            vaccines = Vaccine.objects.filter(created_by=request.user)
            template = 'settings/vaccines_list.html'
            context = {'vaccines': vaccines, 'form': VaccineFilterForm}
            data = {'updated_html': render_to_string(template, context, request)}
            return JsonResponse(data)

    template = 'settings/add_vaccine.html'
    context = {'form': form, 'patient': patient}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def update_vaccine(request, pk):
    """
        DOCSTRING:
        This update_vaccine view is used to update any drug instance, the form used to update the instances will
        be displayed async in the client side, so the content must be sent in JSON Format, for this we make use of
        our render_to_string function to convert into a string the rendered template, if the request.method is 'GET', then
        this form will be sent to the client side as a JsonResponse object, if the request.method is a 'POST' then the form
        will be populated with the content inside our request.POST dictionary, we will evalute this form, if the form is
        valid then the drug instance will be updated, if not a custom error will be sent instead. This view requires
        two arguments: 'request' which expects request object, and 'pk' which expects an drug pk of a particular drug
        instance.
    """
    vaccine = Vaccine.objects.get(pk=pk)
    form = VaccineCreationAndUpdateForm(instance=vaccine)
    if request.method == 'POST':
        form = VaccineCreationAndUpdateForm(request.POST, instance=vaccine)
        if form.is_valid():
            form.save()
            vaccines = Vaccine.objects.filter(created_by=request.user)
            template = 'settings/vaccines_list.html'
            context = {'vaccines': vaccines, 'form': VaccineFilterForm}
            data = {'updated_html': render_to_string(template, context, request)}
            return JsonResponse(data)
    context = {'form': form, 'vaccine': vaccine}
    template = 'settings/update_vaccine.html'
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def vaccine_details(request, pk):
    """
        DOCSTRING:
        This vaccine_details views is used to display the information of a particular drug, this information
        will be displayed async in the client side, so our content must be sent in JSON Format, for this we will make use
        of our render_to_string function and send this string as a JsonResponse. This view requires two arguments,
        'request' which expects a request object and 'pk' which expects a pk of a particular insurance.
    """
    vaccine = Vaccine.objects.get(pk=pk)
    context = {'vaccine': vaccine}
    template = 'settings/vaccine_details.html'
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def delete_vaccine(request, pk):
    """
        DOCSTRING:
        This delete_vaccine view is used to delete any vaccine instances, the form to delete the drug instance
        will be displayed async in the client side, for this we will make use of our render_to_string function to
        convert our content into a string, if the request.method is a 'GET' then the content will be sent as a Json-
        Response, if the request.method is 'POST' then the instance will be deleted automatically.
    """
    vaccine = Vaccine.objects.get(pk=pk)
    if request.method == 'POST':
        vaccine.delete()
        vaccines = Vaccine.objects.filter(created_by=request.user)
        template = 'settings/vaccines_list.html'
        context = {'vaccines': vaccines, 'form': VaccineFilterForm}
        data = {'updated_html': render_to_string(template, context, request)}
        return JsonResponse(data)
    context = {'vaccine': vaccine}
    template = 'settings/delete_vaccine.html'
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)