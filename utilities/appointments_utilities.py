"""
    This appointments_utilities.py file contains all the async and sync functions needed for the appointments app to perform
    correctly.
"""
import calendar
import requests
from xhtml2pdf import pisa
from django.db.models import Q
from twilio.rest import Client
from django.utils import timezone
from django.core.files import File
from django.template.loader import render_to_string
from twilio.base.exceptions import TwilioRestException
from meditracker.settings import NUMVERIFY_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

# Twilio Client instance
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

STATUS_CHOICES = (
    ('OPEN', 'Open'),
    ('CONFIRMED', 'Confirmed'),
    ('CANCELLED', 'Cancelled'),
    ('CLOSED', 'Closed'),
)

DRUG_CATEGORY_CHOICES = (
    ('AP', 'Antipyretics'),
    ('AG', 'Analgesics'),
    ('AM', 'Antimalarial'),
    ('AB', 'Antibiotics'),
    ('AS', 'Antiseptics'),
    ('MS', 'Mood Stabilizers'),
    ('HR', 'Hormone Replacement'),
    ('OC', 'Oral Contraceptives'),
    ('S', 'Stimulants'),
    ('T', 'Tranquilizers'),
    ('ST', 'Statins'),
)

MEDICAL_TEST_CHOICES = (
    ('', '----------'),
    ('AMN', 'Amniocentesis'),
    ('BA', 'Blood Analysis'),
    ('GFA', 'Gastric Fluid Analysis'),
    ('KFT', 'Kidney Function Test'),
    ('LFT', 'Liver Function Test'),
    ('LP', 'Lumbar Puncture'),
    ('MT', 'Malabsorption Test'),
    ('PS', 'PAP Smear'),
    ('PHT', 'Phenolsulfonphthalein Test'),
    ('PGT', 'Pregnancy Test'),
    ('PNT', 'Prenatal Test'),
    ('PBIO', 'Protein-Bound Iodine Test'),
    ('SYPT', 'Syphilis Test'),
    ('THOR', 'Thoracentesis'),
    ('TFT', 'Thyroid Function Test'),
    ('TXT', 'Toxicology Test'),
    ('UR', 'Urinalysis/Uroscopy'),
    ('DI', 'Diagnostic Imaging'),
    ('GT', 'Genetic Testing'),
    ('M', 'Measurement'),
    ('PAVE', 'Physical and Visual Examination')
)


# Async Functions

# Since the power of asynchronous coroutines only come in handy when you yield the control to other coroutine
# in our loop, we will create two async functions and await for one of them.


async def close_consult(delayed_consults, tz, date):
    """
        DOCSTRING:
        This async function will be responsible to close all the consults that have been delayed or where never
        attended by the doctor. It will the set the status consult to 'CLOSED'. It expects three arguments,
        'delayed_consults' expects a queryset of consults which date is than today and the medical_status is False,
        'tz' is the timezone the user is in, 'date' is the current date.
    """
    for c in delayed_consults:
        if c.datetime.astimezone(tz).date() < date.date():
            c.status = 'CLOSED'
            c.save()


async def check_delayed_consults(user):
    """
        DOCSTRING:
        This async function will be the one responsible to retrieve the delayed consults, will collect the current
        date and the collect the timezone active for this user session. It only expects one argument, 'user', is the
        current user, it is used to collect the delayed consults. This async function will await for the close_consults()
        coroutine.
    """
    from appointments.models import BaseConsult
    today = timezone.localtime()
    tzone = timezone.get_current_timezone()
    not_attended_consults = BaseConsult.objects.filter(created_by=user, datetime__date__lte=today.date(), status="OPEN")
    await close_consult(not_attended_consults, tzone, today)


async def validate_number(phone_number):
    """
        DOCSTRING:
        This validate_number async function is used to validate that a phone number exists in the international number-
        ing plan database, this function will make a request to the NumVerify API, if the response contains the 'valid'
        key, then the success key will be set to it's value, else, it won't be affected, the success variable will be
        returned.
    """
    success = False
    payload = {'access_key': NUMVERIFY_API_KEY, 'number': phone_number}
    response = requests.get('http://apilayer.net/api/validate', params=payload).json()
    if 'valid' in response.keys():
        success = response['valid']
    return success


async def send_sms(consult):
    """
        DOCSTRING:
        This send_sms async function is used to send SMS to any client, whenever a phone number is registered in his
        information, the function will pass control to the validate_number function and wait for a response, depending
        on the response, the message will be sent using the Twilio API.
    """
    if consult.patient.phone_number:
        response = await validate_number(consult.patient.phone_number)
        if response:
            message = consult.generate_message()
            try:
                client.messages.create(from_='+18175325217', to=consult.patient.phone_number, body=message)
            except TwilioRestException:
                pass

# Sync Functions


def generate_pdf(template, consult, user):
    """
        DOCSTRING:
        This create_pdf function is used to generate pdf's based on a rendered template, a consult and a user instance,
        after this pdf is created it will be saved to the consult.prescription file field.
    """
    result = open('results.pdf', "w+b")
    context = {'consult': consult, 'user': user}
    source_html = render_to_string(template, context)
    pisa.CreatePDF(source_html, dest=result)
    consult.prescription.save(str(consult.patient) + " - " + str(consult.datetime) + ".pdf", File(result))


def evaluate_consult(consult):
    """
        DOCSTRING:
        This evaluate_consult function is used to evaluate if the consult contains any important information that must
        be handled to the patient as a prescription, if any of these conditions is fulfilled, then we return True, else
        False.
    """
    if (consult.drugs.all() or
            consult.indications != "" or
            consult.actions != "" or
            consult.testing.all() or
            consult.instructions is not None):
        return True
    return False


# consult.lock is True

def collect_months_names(consults_list, tz):
    """
        DOCSTRING: This function is used to collect each of the months in which there are consults pending. It takes
        two arguments, 'consults_list' which takes a consults querySet to evalutate and extract all it's months and
        'tz' which is the current timezone in which the user resides. It will return a list of months names. We will
        make use of the calendar module and the calendar.month_name function to collect the names of the months.
    """
    months_names = []
    for c in consults_list:
        month = calendar.month_name[c.datetime.astimezone(tz).month]
        if month not in months_names:
            months_names.append(month)
    return months_names


def filter_conditional_results(user, **kwargs):
    """
        DOCSTRING:
        This filter_conditional_results() function is used to filter appointments in the All Registers page, there can be
        three different type of individual filters: 'patient', 'month' and 'year', the same way you can mix them to get
        the results expected.
    """
    from appointments.models import BaseConsult
    cleaned_data = kwargs.pop('cleaned_data')
    patient = cleaned_data.get('patient')
    month = int(cleaned_data.get('month'))
    year = int(cleaned_data.get('year'))
    if patient == '' and month == 0 and year == 1920:
        return BaseConsult.objects.filter(
            Q(patient__first_names__icontains=patient) | Q(patient__last_names__icontains=patient),
            datetime__date__month=month, datetime__date__year=year, created_by=user)
    elif patient != '' and month == 0 and year == 1920:
        return BaseConsult.objects.filter(
            Q(patient__first_names__icontains=patient) | Q(patient__last_names__icontains=patient), created_by=user)
    elif patient == '' and month != 0 and year == 1920:
        return BaseConsult.objects.filter(datetime__date__month=month, created_by=user)
    elif patient == '' and month == 0 and year != 1920:
        return BaseConsult.objects.filter(datetime__date__year=year, created_by=user)
    elif patient != '' and month != 0 and year == 1920:
        return BaseConsult.objects.filter(
            Q(patient__first_names__icontains=patient) | Q(patient__last_names__icontains=patient),
            datetime__date__month=month, created_by=user)
    elif patient != '' and month == 0 and year != 1920:
        return BaseConsult.objects.filter(
            Q(patient__first_names__icontains=patient) | Q(patient__last_names__icontains=patient),
            datetime__date__year=year, created_by=user)
    else:
        return BaseConsult.objects.filter(datetime__date__month=month, datetime__date__year=year, created_by=user)
