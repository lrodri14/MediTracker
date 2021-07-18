"""
    This models.py file contains all the models for the Providers App to work properly, it
    contains two models, Providers and Visitors.
"""


from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.


class Provider(models.Model):

    """
        DOCSTRING:
        This class inherits from the models.Model class, tit is used to create Providers objects in our app,
        we declared a PROVIDERS_TYPE_CHOICES tuple which contains all the possible choices for
        the provider_type attribute. We also set an Meta class to configure the unique_together class
        attribute to: ['company', 'created_by']. This class has it's own save method overwritten to
        title() the information from the 'company' and 'address' attributes. Also contains it's own
        __str__ dunder method.
    """

    PROVIDERS_TYPE_CHOICES = (
        ('LP', 'Laboratory'),
        ('MP', 'Medical Provider')
    )

    company = models.CharField('Company', max_length=100, blank=False, null=True, help_text="Provider's Brand")
    address = models.CharField('Address', max_length=250, blank=True, null=True, help_text="Company's Address")
    email = models.EmailField('Email', blank=True, null=True, help_text="Company's Email")
    contact = models.CharField('Phone Number', max_length=100, blank=True, null=True, help_text='Providers Contact')
    provider_type = models.CharField('Type', max_length=100, blank=True, null=True, help_text="Provider's Type", choices=PROVIDERS_TYPE_CHOICES)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, help_text='provider')

    class Meta:
        unique_together = ['company', 'created_by']
        verbose_name = 'Provider'
        verbose_name_plural = 'Providers'
        
    def save(self, *args, **kwargs):
        self.company = self.company.title()
        if self.address:
            self.address = self.address.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.company


class Visitor(models.Model):

    """
        DOCSTRING:
        This class inherits from the models.Model class, tit is used to create Visitors objects in our app,
        This class has it's own save method overwritten to title() the information from the 'name' and 'last_name'
        attributes. Also contains it's own __str__ dunder method.
    """

    name = models.CharField("Visitor's Name", max_length=100, blank=False, null=True, help_text="Visitor's First Name")
    last_name = models.CharField("Visitor's Last Name", max_length=100, blank=False, null=True, help_text="Visitor's Last Name")
    contact = models.CharField('Phone Number', max_length=100, blank=True, null=True, help_text="Visitor's Contact")
    email = models.EmailField('Email', blank=True, null=True, help_text="Visitor's Email")
    company = models.ForeignKey(Provider, on_delete=models.CASCADE, blank=False, null=True, help_text='Providers Brand')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, help_text='Created By', related_name='visitor')

    class Meta:
        verbose_name = 'Visitor'
        verbose_name_plural = 'Visitors'

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        self.last_name = self.last_name.title()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name + ' ' + self.last_name


