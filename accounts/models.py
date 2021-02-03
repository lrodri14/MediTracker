"""
    This models.py file contains all the models needed to perform user functionality inside the app. It is composed of
    5 classes.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from utilities.global_utilities import LOCATION_CHOICES, ORIGIN_CHOICES

# Create your models here.


class CustomUser(AbstractUser):

    """
        DOCSTRING:
        This CustomUser class is used to create user instances, this class inherits from the AbstractUser class since
        we needed to add some extra information to the User, every time the user instance is created a new UserProfile
        class instance is created as well, linked through a OneToOne relationship to the user. We overwrote our save
        method to capitalize the user names and last names whenever is created.
    """

    ROLL_CHOICES = (
        ('Doctor', 'Doctor'),
        ('Assistant', 'Assistant'),
        ('Patient', 'Patient')
    )

    SPECIALITY_CHOICES = (
        ('ALLERGY & IMMUNOLOGY', 'Allergy & Immunology'),
        ('ANESTHESIOLOGY', 'Anesthesiology'),
        ('DERMATOLOGY', 'Dermatology'),
        ('DENTIST', 'Dentist'),
        ('DIAGNOSTIC RADIOLOGY', 'Diagnostic Radiology'),
        ('EMERGENCY MEDICINE', 'Emergency Medicine'),
        ('FAMILY MEDICINE', 'Family Medicine'),
        ('INTERNAL MEDICINE', 'Internal Medicine'),
        ('MEDICAL GENETICS', 'Medical Genetics'),
        ('NEUROLOGY', 'Neurology'),
        ('NUCLEAR MEDICINE', 'Nuclear Medicine'),
        ('OBSTETRICS AND GYNECOLOGY', 'Obstetrics & Gynechology'),
        ('OPHTHALMOLOGY', 'Ophthalmolgy'),
        ('PATHOLOGY', 'Pathology'),
        ('PEDIATRICS', 'Pediatrics'),
        ('PHYSICAL MEDICINE & REHABILITATION', 'Physical Medicine & Rehabilitation'),
        ('PREVENTIVE MEDICINE', 'Preventive Medicine'),
        ('PSYCHIATRY', 'Psychiatry'),
        ('RADIATION ONCOLOGY', 'Radiation Oncology'),
        ('SURGERY', 'Surgery'),
        ('UROLOGY', 'Urology'),
    )
    email = models.EmailField(blank=False, unique=True)
    roll = models.CharField('Roll', max_length=25, blank=False, help_text='Choose the roll you will acquire in this account.', choices=ROLL_CHOICES)
    speciality = models.CharField('Speciality', max_length=100, blank=True, help_text='If your roll is (A, Assistant), leave this field blank.', choices=SPECIALITY_CHOICES)

    def save(self, *args, **kwargs):
        self.first_name = self.first_name.title()
        self.last_name = self.last_name.title()
        created = not self.pk
        super(CustomUser, self).save(*args, **kwargs)
        if created:
            UsersProfile.objects.create(user=self)
            UserSetting.objects.create(user=self)


class UsersProfile(models.Model):

    """
        DOCSTRING:
        This UsersProfile class is linked through a OneToOne relationship with the CustomUser class, this class will
        store all the personal information of the user. We created the class Class Meta to provide extra functionality
        and finally we created the class's own __str__ dunder method.
    """

    GENDER_CHOICES = (
        ('Masculine', 'Masculine'),
        ('Femenine', 'Femenine'),
    )

    user = models.OneToOneField(CustomUser, blank=True, null=True, on_delete=models.CASCADE, verbose_name='user', related_name='profile')
    profile_pic = models.ImageField('Profile Picture', blank=True, null=True, upload_to='accounts/profile_pictures')
    background_pic = models.ImageField('Background Picture', blank=True, null=True, upload_to='accounts/background_pictures')
    bio = models.TextField('Biography', blank=True, null=True, help_text='Let us know about you')
    gender = models.CharField('Gender', max_length=25, blank=False, null=True, choices=GENDER_CHOICES)
    birth_date = models.DateField('Birth Date', blank=True, null=True, help_text="Birth date")
    origin = models.CharField('Origin', max_length=50, blank=False, null=True, choices=ORIGIN_CHOICES)
    location = models.CharField('Location', max_length=100, blank=False, null=True, choices=LOCATION_CHOICES, help_text='Provide your location')
    address = models.TextField('Address', max_length=200, blank=False, null=True, help_text='Provide your exact address')
    phone_number = models.CharField('Phone Number', max_length=15, null=True, blank=True, help_text='Provide your phone number')
    tzone = models.CharField('Timezone', max_length=40, blank=False, null=True, help_text='Provide your timezone')
    contacts = models.ManyToManyField(to=CustomUser, blank=True, help_text='Contacts List')

    class Meta:
        ordering = ['user']
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return str(self.user) + ' - ' + 'User Profile'


class UserSetting(models.Model):
    wallpaper = models.ImageField(verbose_name='Wallpaper', blank=True, null=True, help_text="User's Wallpaper")
    user = models.OneToOneField(to=CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='User Settings', verbose_name='User Settings')

    class Meta:
        verbose_name = "User Setting"
        verbose_name_plural = "User Settings"

    def __str__(self):
        return str(self.user) + " Settings"


class MailingCredential(models.Model):

    """
        DOCSTRING:
        This MailingCredential class will store all the data needed to open a mailing connection through the SMTP
        Protocol, an instance of this class will be created once a new user has been created, it is linked through
        a OneToOne relationship with the CustomUser class, the instance will be prefilled if the user account data
        fulfills certain conditions. It contains it's Meta class and it's own __str__ dunder method.
    """

    smtp_server = models.CharField("SMTP Server", max_length=100, blank=True, null=True, help_text="Provide the SMTP Server", default="")
    port = models.IntegerField("Port", blank=True, null=True, help_text="Provide the port used by your server")
    email = models.EmailField("Email", blank=True, null=True, help_text="Provide your email")
    password = models.CharField("Password", max_length=254, blank=True, null=True, help_text="Provide your password")
    use_tls = models.BooleanField("Use TLS? (Recommended)", default=False)
    user = models.OneToOneField(CustomUser, blank=True, null=True, related_name="mailing_credentials", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Mailing Credential'
        verbose_name_plural = 'Mailing Credentials'

    def __str__(self):
        return str(self.user) + ' - ' + 'Mailing Credentials'


class ContactRequest(models.Model):

    """
        DOCSTRING:
        This ContactRequest class is used to link users together for interaction to be possible, whenever a user wants
        to add a specific user to it's contacts list, an instance of this class will be created and deleted independently
        of the contact request receiver's response.

    """

    to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='User to send the request', verbose_name='Request Receive', related_name='request')
    from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='User sending the request', verbose_name='Request Sender')

    class Meta:
        verbose_name = 'Contact Request'
        verbose_name_plural = 'Contact Requests'
        unique_together = ['from_user', 'to_user']

    def __str__(self):
        return 'Contact request sent from: {} to {}'.format(self.from_user, self.to_user)


class Chat(models.Model):

    """
        DOCSTRING:
        * Class used only as a reference since all the message will be stored in a Twilio Chat Channel *
        This chat class is used as a reference to indicate that the users inside the participants field can interact with
        each other, when a link between two users has been created, an instance of this Chat class will also be created.
        This class contains it's Meta class, it's own __str__ dunder method and a get_destination method.
    """

    participants = models.ManyToManyField(to=CustomUser, blank=True, verbose_name='Participants', related_name='participants', help_text='Chat Participants')

    class Meta:
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'

    def __str__(self):
        return "{}'s and {}'s private chat".format(self.participants.all()[0], self.participants.all()[1])

    def get_destination(self, user):
        """
            DOCSTRING:
            This get_destination method inside the Chat class, is used to return the receiver of the messages from the
            authenticated user's point of view. In the user's interface a Chat window will be displayed in the social
            section, the destination will be the user to whom the authenticated user is linked to.
        """
        destination = self.participants.all()[1] if user == self.participants.all()[0] else self.participants.all()[0]
        return destination
