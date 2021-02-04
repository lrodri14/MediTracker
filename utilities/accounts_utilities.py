"""
    This accounts_utilities.py file contains all the imports, variable definitions and the function definitions needed for
    the accounts app to perform correctly, it is composed of one variable definition,'domains' which is a dictionary containing
    all the most used smtp servers worldwide, this way every time a user is created if the account email meets these requirements
    some initial information will be filled, this file contains two function definitions.
"""

from django.core.mail.backends.smtp import EmailBackend
from accounts.models import ContactRequest


domains = {
    'gmail.com': {'smtp_server': 'smtp.gmail.com', 'port': 587, 'use_tls': True},
    'yahoo.com': {'smtp_server': 'smtp.mail.yahoo.com', 'port': 465, 'use_tls': True},
    'hotmail.com': {'smtp_server': 'smtp.live.com', 'port': 465, 'use_tls': True},
    'outlook.com': {'smtp_server': 'smtp.live.com', 'port': 587, 'use_tls': True},
}


def set_mailing_credentials(email, user):
    """
        DOCSTRING:
        This set_mailing_credentials function is used to create a MailingCredential instance whenever a new user is created
        independently if the email meets the requirements to fill the instance with initial data, this function only
        takes two parameters the user itself and the email which we use to fill the instance with data if needed.
    """
    from accounts.models import MailingCredential
    domain = email.split("@")[1]
    if domains.get(domain):
        smtp_server = domains[domain]['smtp_server']
        port = domains[domain]['port']
        use_tls = domains[domain]['use_tls']
        mailing_info = MailingCredential.objects.create(smtp_server=smtp_server, port=port, use_tls=use_tls, user=user)
        mailing_info.save()
    else:
        mailing_info = MailingCredential.objects.create(user=user)
        mailing_info.save()


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
