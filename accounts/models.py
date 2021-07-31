"""
    This models.py file contains all the models needed to perform user functionality inside the app. It is composed of
    5 classes.
"""

import string
import random
from django.db import models
from django.contrib.auth.models import AbstractUser
from utilities.global_utilities import LOCATION_CHOICES, ORIGIN_CHOICES
from utilities.paypal_utilities import create_product, create_plan

# Create your models here.

class CustomUser(AbstractUser):

    """
        DOCSTRING:
        This CustomUser class is used to create user instances, this class inherits from the AbstractUser class since
        we needed to add some extra information to the User, every time the user instance is created a new UserProfile
        class instance is created as well, linked through a OneToOne relationship to the user. We created the assign_roll
        method that will set the current instance's roll and overwrote our save method to capitalize the user names and
        last names whenever is created.
    """

    ROLL_CHOICES = (
        ('DOCTOR', 'Doctor'),
        ('ASSISTANT', 'Assistant'),
        # ('PATIENT', 'Patient'),
        # ('LABORATORY', 'Laboratory'),
        # ('PHARMACY', 'Pharmacy')
    )

    email = models.EmailField(blank=False, unique=True)
    roll = models.CharField(verbose_name='Roll', max_length=25, blank=False, help_text='Choose the roll you will acquire in this account.', choices=ROLL_CHOICES)
    confirmed = models.BooleanField(verbose_name='Confirmed?', blank=False, null=True, help_text='Confirmed User Account', default=False)

    def assign_roll(self, speciality):
        """
            DOCSTRING: This method 'assign_roll' will receive a boolean value parameter, which will define the roll inside
            the current instance. If the speciality parameter receives a True boolean value, then roll will be assigned as
            'Doctor' if that's not the case, then it will be set to 'Assistant'
        """
        if speciality is not False:
            self.roll = 'DOCTOR'
        else:
            self.roll = 'ASSISTANT'

    def save(self, *args, **kwargs):
        self.first_name = self.first_name.title()
        self.last_name = self.last_name.title()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['username', ]
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class Doctor(CustomUser):

    """
        DOCSTRING: This Doctor class is used to create Doctor roll user instances, it inherits functionality from
        CustomUser class, we defined two extra fields called speciality to choose the doctor's sepaciality and linking_id
        which will store a unique characters id, this id will be used by Assistant user instances to link to the doctors.
        We added a new method called generate_linking_id() which will generate and assign the id mentiones before.
    """

    SPECIALITY_CHOICES = (('A&I', 'Allergy & Immunology'), ('DT', 'Dentist'), ('IM', 'Internal Medicine'), ('GM', 'General Medicine'),
                          ('NEU', 'Neurology'), ('O&G', 'Obstetrics & Gynecology'), ('OPH', 'Ophthalmology'), ('PED', 'Pediatrics'),
                          ('PSY', 'Psychiatry'), ('SRG', 'Surgery'), ('URO', 'Urology'))

    SUBSCRIPTION_CHOICES = (('BASIC', 'Basic'), ('PREMIUM', 'Premium'))

    speciality = models.CharField(verbose_name='Speciality', max_length=100, blank=True, help_text="Doctor's Speciality", choices=SPECIALITY_CHOICES)
    linking_id = models.CharField(verbose_name='Linking ID', max_length=14, blank=True, null=True, help_text='Used by Assistants to link to Doctors', unique=True)
    subscription = models.CharField(verbose_name='Subscription', max_length=10, blank=True, null=True, help_text='Account Subscription Type', default=SUBSCRIPTION_CHOICES[0][0], choices=SUBSCRIPTION_CHOICES)

    def generate_linking_id(self):
        """
            DOCSTRING: This generate_linking_id method will create a 14 character unique string, that will be used in the
            linking processes between the assistants and doctors, after it's generated it will be assigned to the linking_id
            attribute.
        """
        generated_linking_id = ''
        characters = string.ascii_letters + string.digits
        for i in range(0, 12):
            random_digit = random.randint(0, len(characters)-1)
            generated_linking_id += characters[random_digit]
            if len(generated_linking_id) == 4 or len(generated_linking_id) == 9:
                generated_linking_id += '-'
        self.linking_id = generated_linking_id

    def save(self, *args, **kwargs):
        created = self.pk is None
        super().save(*args, **kwargs)
        if created:
            UserAccountSettings.objects.create(user=self)
            UserGeneralSettings.objects.create(wallpaper=1, user=self)
            MailingCredential.objects.create(email=self.email, user=self)

    class Meta:
        verbose_name = 'Doctor'
        verbose_name_plural = 'Doctors'
        ordering = ['first_name', ]


class Assistant(CustomUser):

    """
        DOCSTRING: This Assistant class is used to create Assistant roll user instances, it inherits functionality from the
        CustomUser class, we added an extra field 'doctors' which declares a relationship from ManyToMany with the Doctor
        class, this way the assistant can be able to relate with as many doctors as needed.

        *NOTE* Assistant can only relate to a single doctor until now, in future updates this functionality will be added.
    """

    doctors = models.ManyToManyField(to=Doctor, verbose_name='Doctors', blank=True, help_text="Doctor's who this assistant will be working with")

    def save(self, *args, **kwargs):
        created = self.pk is None
        super().save(*args, **kwargs)
        if created:
            UserAccountSettings.objects.create(user=self)
            UserGeneralSettings.objects.create(wallpaper=1, user=self)

    class Meta:
        verbose_name = 'Assistant'
        verbose_name_plural = 'Assistants'
        ordering = ['first_name', ]


class UsersProfile(models.Model):

    """
        DOCSTRING:
        This UsersProfile class is linked through a OneToOne relationship with the CustomUser class, this class will
        store all the personal information of the user. We created the class Class Meta to provide extra functionality
        and finally we created the class's own __str__ dunder method.
    """

    AVAILABILITY_CHOICES = (
        ('A', 'Available'),
        ('B', 'Busy'),
    )

    GENDER_CHOICES = (
        ('MASCULINE', 'Masculine'),
        ('FEMENINE', 'Femenine'),
    )

    user = models.OneToOneField(CustomUser, blank=True, null=True, on_delete=models.CASCADE, verbose_name='user', related_name='profile')
    availability = models.CharField(max_length=50, blank=False, null=True, verbose_name='Availability', help_text='User Availability', choices=AVAILABILITY_CHOICES, default='A')
    profile_pic = models.ImageField('Profile Picture', blank=True, null=True, upload_to='accounts/profile_pictures')
    bio = models.TextField('Biography', blank=True, null=True, help_text='Let us know about you')
    gender = models.CharField('Gender', max_length=25, blank=False, null=True, choices=GENDER_CHOICES)
    birth_date = models.DateField('Birth Date', blank=False, null=True, help_text="Birth date")
    origin = models.CharField('Origin', max_length=50, blank=False, null=True, choices=ORIGIN_CHOICES)
    location = models.CharField('Location', max_length=100, blank=False, null=True, choices=LOCATION_CHOICES, help_text='Provide your location')
    address = models.TextField('Address', max_length=200, blank=True, null=True, help_text='Provide your exact address')
    phone_number = models.CharField('Phone Number', max_length=15, null=True, blank=True, help_text='Provide your phone number')
    contacts = models.ManyToManyField(to=CustomUser, blank=True, help_text='Contacts List')
    block_list = models.ManyToManyField(to=CustomUser, blank=True, help_text="User's Block List", verbose_name="Block List", related_name='block_list')

    def __str__(self):
        return str(self.user) + ' - ' + 'User Profile'

    class Meta:
        ordering = ['user']
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'


class UserAccountSettings(models.Model):

    """
        DOCSTRING:
        This UserAccountSettings class is linked through a OneToOne relationship with the CustomUser class, this class will
        store all the user's account settings . We created the class Class Meta to provide extra functionality
        and finally we created the class's own __str__ dunder method.
    """

    SESSION_EXPIRE_TIME = (
        (300, '5 Minutes'),
        (600, '10 Minutes'),
        (1200, '20 Minutes'),
        (1800, '30 Minutes'),
        (3600, '1 Hour'),
    )

    tzone = models.CharField('Timezone', max_length=40, blank=False, null=True, help_text='Provide your timezone')
    session_expire_time = models.IntegerField('Session Expire Time', blank=True, null=True, help_text='Provide your session time expire timeout', choices=SESSION_EXPIRE_TIME, default=1800)
    user = models.OneToOneField(to=CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='User Settings', verbose_name='User Settings', related_name='account_settings')

    def __str__(self):
        return str(self.user) + " Account Settings"

    class Meta:
        verbose_name = "User Account Setting"
        verbose_name_plural = "User Account Settings"


class UserGeneralSettings(models.Model):
    """
        DOCSTRING:
        This UserGeneralSettings class is linked through a OneToOne relationship with the CustomUser class, this class will
        store all the user's general settings . We created the class Class Meta to provide extra functionality
        and finally we created the class's own __str__ dunder method.
    """
    wallpaper = models.CharField('Wallpaper', max_length=100, blank=True, null=True, help_text='Choose Wallpaper')
    sfx = models.BooleanField('SFX', blank=True, null=True, help_text='Sound Effects Switch', default=True)
    notifications = models.BooleanField('Notifications', blank=True, null=True, help_text='Notifications', default=True)
    user = models.OneToOneField(to=CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='User Settings', verbose_name='User Settings', related_name='general_settings')

    def __str__(self):
        return str(self.user) + " General Settings"

    class Meta:
        verbose_name = "User General Setting"
        verbose_name_plural = "User General Settings"


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

    def __str__(self):
        return str(self.user) + ' - ' + 'Mailing Credentials'

    def save(self, *args, **kwargs):
        from utilities.accounts_utilities import set_mailing_credentials
        available_credentials = set_mailing_credentials(self.email)
        if available_credentials:
            self.smtp_server = available_credentials['smtp_server']
            self.port = available_credentials['port']
            self.use_tls = available_credentials['use_tls']
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Mailing Credential'
        verbose_name_plural = 'Mailing Credentials'


class ContactRequest(models.Model):

    """
        DOCSTRING:
        This ContactRequest class is used to link users together for interaction to be possible, whenever a user wants
        to add a specific user to it's contacts list, an instance of this class will be created and deleted independently
        of the contact request receiver's response.

    """

    to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='User to send the request', verbose_name='Request Receive', related_name='request')
    from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='User sending the request', verbose_name='Request Sender')

    def __str__(self):
        return 'Contact request sent from: {} to {}'.format(self.from_user, self.to_user)

    class Meta:
        verbose_name = 'Contact Request'
        verbose_name_plural = 'Contact Requests'
        unique_together = ['from_user', 'to_user']


class Chat(models.Model):

    """
        DOCSTRING:
        * Class used only as a reference since all the message will be stored in a Twilio Chat Channel *
        This chat class is used as a reference to indicate that the users inside the participants field can interact with
        each other, when a link between two users has been created, an instance of this Chat class will also be created.
        This class contains it's Meta class, it's own __str__ dunder method and a get_destination method.
    """

    participants = models.ManyToManyField(to=CustomUser, blank=True, verbose_name='Participants', related_name='participants', help_text='Chat Participants')
    last_message = models.TextField(blank=True, null=True, help_text="Chat's last message", verbose_name="Chat's last message")
    last_message_sender = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='Last message sender', verbose_name='Last message sender')

    def __str__(self):
        try:
            return "{}'s and {}'s private chat".format(self.participants.all()[0], self.participants.all()[1])
        except IndexError:
            return 'Hello'

    def get_destination(self, user):
        """
            DOCSTRING:
            This get_destination method inside the Chat class, is used to return the receiver of the messages from the
            authenticated user's point of view. In the user's interface a Chat window will be displayed in the social
            section, the destination will be the user to whom the authenticated user is linked to.
        """

        destination = self.participants.all()[1] if user == self.participants.all()[0] else self.participants.all()[0]
        return destination

    class Meta:
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'


class Message(models.Model):
    """
        DOCSTRING:
        Message class is used to create text messages which will be related to the corresponding chat.
    """

    MESSAGE_STATUS_CHOICES = (
        ('UNREAD', 'Unread'),
        ('READ', 'Read')
    )

    datetime = models.DateTimeField('datetime', blank=True, null=True, help_text='Message time creation')
    text = models.TextField('Text', blank=True, null=True, help_text='Message Text')
    image = models.ImageField('Image', blank=True, null=True, help_text='Message Image')
    status = models.CharField('status', max_length=6, blank=True, null=True, help_text='Message Status', default=MESSAGE_STATUS_CHOICES[0][0], choices=MESSAGE_STATUS_CHOICES)
    chat = models.ForeignKey(to=Chat, on_delete=models.CASCADE, blank=True, null=True, help_text='Chat', verbose_name='Chat', related_name='message')
    created_by = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE, blank=True, null=True, help_text='Sender', verbose_name='Sender')


class Product(models.Model):
    """
        DOCSTRING:
        This model is used to create subscription product which can be consumed by the users.
    """
    USER_TYPE_CHOICES = (('DOCTOR', 'Doctor'), ('ASSISTANT', 'Assistant'),)
    PLAN_CHOICES = (('PREMIUM', 'Premium'),)
    TYPE_CHOICES = (('SERVICE', 'Service'),)
    CATEGORY_CHOICES = (('SOFTWARE', 'Software'),)
    product_id = models.CharField(max_length=255, blank=True, null=True, verbose_name='Product ID', help_text='Product ID')
    user_type = models.CharField(max_length=50, blank=False, null=True, verbose_name='Product User Type', help_text='Product User Type', choices=USER_TYPE_CHOICES)
    plan = models.CharField(max_length=50, blank=False, null=True, verbose_name='Product Plan Type',help_text='Product Plan Type', choices=PLAN_CHOICES)
    name_id = models.CharField(max_length=50, blank=True, null=True, verbose_name='Name ID', help_text='Product Name ID', unique=True)
    name = models.CharField(max_length=50, blank=True, null=True, verbose_name='Name', help_text='Product Name', unique=True)
    description = models.TextField('Description', blank=False, null=True, help_text='Product Description')
    product_type = models.CharField(max_length=50, blank=False, null=True, verbose_name='Type', help_text='Product Type', choices=TYPE_CHOICES, default=TYPE_CHOICES[0][1])
    category = models.CharField(max_length=50, blank=False, null=True, verbose_name='Category', help_text='Product Category', choices=CATEGORY_CHOICES, default=CATEGORY_CHOICES[0][1])
    image = models.ImageField('Image', blank=True, null=True, help_text='Product Image')
    home_image = models.ImageField('Home Image', blank=True, null=True, help_text='Product Image')
    get_product_url = models.URLField(blank=True, null=True, verbose_name='Get Product URL', help_text='Get Product URL')
    edit_product_url = models.URLField(blank=True, null=True, verbose_name='Edit Product URL', help_text='Edit Product URL')

    def save(self, *args, **kwargs):
        self.name_id = 'SEALENA-{}-{}'.format(self.user_type, self.plan)
        self.name = 'SEALENA {} {} SUBSCRIPTION'.format(self.user_type, self.plan)
        self.description = self.description.capitalize()
        response = create_product(self.name_id, self.name, self.description, self.product_type, self.category)
        self.product_id = response['id']
        self.get_product_url = response['links'][0]['href']
        self.edit_product_url = response['links'][1]['href']
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Plan(models.Model):
    """
        DOCSTRING:
        This model is used to create plans which can be consumed by the users, such as a monthly or yearly subscription
        plan.
    """
    FREQUENCY_CHOICES = (('MONTH', 'Monthly'),)
    STATUS_CHOICES = (('CREATED', 'Created'), ('ACTIVE', 'Active'), ('INACTIVE', 'Inactive'))
    TENURE_CHOICES = (('TRIAL', 'Trial'), ('REGULAR', 'Regular'))
    SEQUENCE_CHOICES = [(str(x), x) for x in range(1, 6)]
    SETUP_FEE_FAILURE_ACTIONS = (('CANCEL', 'Cancel'), ('CONTINUE', 'Continue'))
    product_plan_id = models.CharField(max_length=255, blank=True, null=True, verbose_name='Product ID', help_text='Product Plan ID')
    user_type = models.CharField(max_length=50, blank=True, null=True, verbose_name='Product User Type', help_text='Product User Type')
    plan = models.CharField(max_length=50, blank=True, null=True, verbose_name='Product Plan Type',help_text='Product Plan Type')
    name_id = models.CharField(max_length=50, blank=True, null=True, verbose_name='Name ID', help_text='Plan Name ID', unique=True)
    name = models.CharField(max_length=50, blank=True, null=True, verbose_name='Name', help_text='Plan Name', unique=True)
    description = models.TextField('Description', blank=False, null=True, help_text='Plan Description')
    status = models.CharField(max_length=50, blank=False, null=True, verbose_name='Status' ,help_text='Plan Status', choices=STATUS_CHOICES)
    frequency = models.CharField(max_length=50, blank=False, null=True, verbose_name='Frequency', help_text='Plan Billing Frequency', choices=FREQUENCY_CHOICES)
    price = models.CharField(max_length=5, blank=False, null=True, verbose_name='Price' ,help_text='Plan Price')
    tenure = models.CharField(max_length=50, blank=False, null=True, verbose_name='Tenure', help_text='Plan Tenure', choices=TENURE_CHOICES)
    sequence = models.CharField(max_length=2, blank=False, null=True, verbose_name='Sequence', help_text='Plan Sequence')
    total_cycles = models.IntegerField('Cycles', blank=False, null=True, help_text='Cycles to be billed')
    auto_billing = models.BooleanField('Auto Billing', blank=False, null=True, help_text='Plan Billing Type')
    setup_fee = models.IntegerField('Setup Fee', blank=False, null=True, help_text='Setup Fee', default=0)
    setup_fee_failure_action = models.CharField(max_length=10, blank=False, null=True, verbose_name='Billing Failure Action', help_text='Billing Failure Action', choices=SETUP_FEE_FAILURE_ACTIONS)
    payment_failure_threshold = models.IntegerField('Payment Failure Threshold', blank=False, null=True, help_text='Payment Failure Threshold')
    get_plan_url = models.URLField(blank=True, null=True, verbose_name='Get Plan URL', help_text='Get Plan URL')
    edit_plan_url = models.URLField(blank=True, null=True, verbose_name='Edit Plan URL', help_text='Edit Plan URL')
    deactivate_plan_url = models.URLField(blank=True, null=True, verbose_name='Deactivate Plan URL', help_text='Deactivate Plan URL')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=False, null=True, verbose_name='Plan Product', help_text='Plan Product', related_name='product_plan')

    def save(self, *args, **kwargs):
        self.user_type = self.product.user_type
        self.plan = self.product.plan
        self.name_id = 'SEALENA-{}-{}-{}-PLAN'.format(self.user_type, self.plan, self.frequency)
        self.name = 'SEALENA {} {} {} PLAN'.format(self.user_type, self.plan, self.frequency)
        if self.total_cycles >= 1 and self.price > 0:
            self.price = 0
        if self.payment_failure_threshold >= 4:
            self.payment_failure_threshold = 3
        response = create_plan(self.product.product_id, self.name_id, self.name, self.description, self.status, self.frequency,
                               self.price, self.tenure, self.sequence, self.total_cycles, self.auto_billing,
                               self.setup_fee, self.setup_fee_failure_action, self.payment_failure_threshold)
        self.product_plan_id = response['id']
        self.get_plan_url = response['links'][0]['href']
        self.edit_plan_url = response['links'][1]['href']
        self.deactivate_plan_url = response['links'][2]['href']
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Subscription(models.Model):
    """
        DOCSTRING:
        This Subscription model is used to store subscription information belonging to a specific user
    """
    subscription_id = models.CharField(max_length=255, blank=False, null=True, verbose_name='Subscription ID', help_text='Subscription ID')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=False, null=True, verbose_name='Subscription User', help_text='Subscription User', related_name='subs')

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name + ' Subscription'