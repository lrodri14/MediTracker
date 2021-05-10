"""
    This accounts_utilities.py file contains all the imports, variable definitions and the function definitions needed for
    the accounts app to perform correctly, it is composed of one variable definition,'domains' which is a dictionary containing
    all the most used smtp servers worldwide, this way every time a user is created if the account email meets these requirements
    some initial information will be filled, this file contains two function definitions.
"""

from accounts.models import ContactRequest
from django.core.mail.backends.smtp import EmailBackend
from appointments.models import GeneralConsult, AllergyAndImmunologicalConsult, DentalConsult, NeurologicalConsult, \
                                GynecologicalConsult, OphthalmologyConsult, PsychiatryConsult, SurgicalConsult, UrologicalConsult
from appointments.forms import GeneralConsultCreationForm, AllergyAndImmunologicalConsultCreationForm, DentalConsultCreationForm, \
                                NeurologicalConsultCreationForm, GynecologicalConsultCreationForm, OphthalmologyConsultCreationForm, \
                                PsychiatryConsultCreationForm, SurgicalConsultCreationForm, UrologicalConsultCreationForm, \
                                UpdateGeneralConsultForm, UpdateAllergyAndImmunologicalConsultForm, UpdateDentalConsultForm, \
                                UpdateNeurologicalConsultForm, UpdateGynecologicalConsultForm, UpdateOphthalmologyConsultForm, \
                                UpdatePsychiatryConsultForm, UpdateSurgicalConsultForm, UpdateUrologicalConsultForm


domains = {
    'gmail.com': {'smtp_server': 'smtp.gmail.com', 'port': 587, 'use_tls': True},
    'yahoo.com': {'smtp_server': 'smtp.mail.yahoo.com', 'port': 465, 'use_tls': True},
    'hotmail.com': {'smtp_server': 'smtp.live.com', 'port': 465, 'use_tls': True},
    'outlook.com': {'smtp_server': 'smtp.live.com', 'port': 587, 'use_tls': True},
}

speciality_mapping = {
    'A&I': {'model': AllergyAndImmunologicalConsult, 'creation_form': AllergyAndImmunologicalConsultCreationForm, 'updating_form': UpdateAllergyAndImmunologicalConsultForm},
    'DT': {'model': DentalConsult, 'creation_form': DentalConsultCreationForm, 'updating_form': UpdateDentalConsultForm},
    'IM': {'model': GeneralConsult, 'creation_form': GeneralConsultCreationForm, 'updating_form': UpdateGeneralConsultForm},
    'GM': {'model': GeneralConsult, 'creation_form': GeneralConsultCreationForm, 'updating_form': UpdateGeneralConsultForm},
    'NEU': {'model': NeurologicalConsult, 'creation_form': NeurologicalConsultCreationForm, 'updating_form': UpdateNeurologicalConsultForm},
    'O&G': {'model': GynecologicalConsult, 'creation_form': GynecologicalConsultCreationForm, 'updating_form': UpdateGynecologicalConsultForm},
    'OPH': {'model': OphthalmologyConsult, 'creation_form': OphthalmologyConsultCreationForm, 'updating_form': UpdateOphthalmologyConsultForm},
    'PED': {'model': GeneralConsult, 'creation_form': GeneralConsultCreationForm, 'updating_form': UpdateGeneralConsultForm},
    'PSY': {'model': PsychiatryConsult, 'creation_form': PsychiatryConsultCreationForm, 'updating_form': UpdatePsychiatryConsultForm},
    'SRG': {'model': SurgicalConsult, 'creation_form': SurgicalConsultCreationForm, 'updating_form': UpdateSurgicalConsultForm},
    'URO': {'model': UrologicalConsult, 'creation_form': UrologicalConsultCreationForm, 'updating_form': UpdateUrologicalConsultForm}
}


def set_mailing_credentials(email):
    """
        DOCSTRING:
        This set_mailing_credentials function is used to create a MailingCredential instance whenever a new user is created
        independently if the email meets the requirements to fill the instance with initial data, this function only
        takes two parameters the user itself and the email which we use to fill the instance with data if needed.
    """
    domain = email.split("@")[1]
    if domains.get(domain):
        smtp_server = domains[domain]['smtp_server']
        port = domains[domain]['port']
        use_tls = domains[domain]['use_tls']
        credentials = {'smtp_server': smtp_server, 'port': port, 'use_tls': use_tls}
        return credentials
    else:
        return False


def open_connection(user_mailing_credentials):
    """
        DOCSTRING:
        This open_connection function is used to open an SMTP connection when the user tries to send a message to someone,
        this function only expects one argument, the mailing_credentials of the sender, we will open the connection creating
        an instance of the EmailBackend class, and returning this instance.
    """
    smtp_server = user_mailing_credentials.smtp_server
    port = user_mailing_credentials.port
    email = user_mailing_credentials.email
    password = user_mailing_credentials.password
    use_tls = user_mailing_credentials.use_tls
    connection = EmailBackend(host=smtp_server, port=port, username=email, password=password, use_tls=use_tls)
    return connection


def check_requests(user):
    if not ContactRequest.objects.filter(to_user=user):
        return False
    return True
