from django import forms
from django.utils import timezone
from django.contrib.auth import get_user_model
from utilities.appointments_utilities import STATUS_CHOICES
from appointments.models import BaseConsult

class PatientCreationFilterForm(forms.Form):
    year = forms.ChoiceField(required=False, label='Year', widget=forms.Select)
    # date_from = forms.DateField(required=False, label='Date From', widget=forms.SelectDateWidget)
    # date_to = forms.DateField(required=False, label='Date To', widget=forms.SelectDateWidget)

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super().__init__(*args, **kwargs)
        user = get_user_model().objects.get(username=user)
        year_joined = user.date_joined.date().year
        self.fields['year'].choices = [(x, x) for x in range(year_joined, timezone.localtime().date().year + 1)]
        self.fields['year'].initial = timezone.localtime().date().year
        # self.fields['date_from'].initial = date_joined
        # self.fields['date_to'].initial = timezone.localtime().date()


class AgeDistributionFilterForm(forms.Form):

    AGEDISTCHOICES = (
        (0, '0-10'),
        (1, '11-20'),
        (2, '21-30'),
        (3, '31-40'),
        (4, '41-50'),
        (5, '51-60'),
        (6, '61-70'),
        (7, '71-80'),
        (8, '81-90'),
        (9, '91-100'),
        (10, '101+'),
    )

    age_from = forms.ChoiceField(required=False, label='Age From', widget=forms.Select, choices=AGEDISTCHOICES)
    age_to = forms.ChoiceField(required=False, label='Age To', widget=forms.Select, choices=AGEDISTCHOICES)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, *kwargs)
        self.fields['age_to'].initial = 10


class GenderDistributionFilterForm(forms.Form):

    GENDER_CHOICES = (
        ('all', '----------'),
        ('F', 'Femenine'),
        ('M', 'Masculine')
    )

    gender = forms.ChoiceField(required=False, label='Gender', widget=forms.Select, choices=GENDER_CHOICES)


class StatusDistributionFilterForm(forms.Form):
    status = forms.ChoiceField(required=False, label='Status', widget=forms.Select, choices=STATUS_CHOICES)


class MedicalStatusDistributionFilterForm(forms.Form):
    MEDICAL_STATUS_CHOICES = (
        ('all', '----------'),
        ('true', 'Attended'),
        ('false', 'Unattended')
    )
    medical_status = forms.ChoiceField(required=False, label='Medical Status', widget=forms.Select, choices=MEDICAL_STATUS_CHOICES)


class ConsultCountFilterForm(forms.Form):

    date_from = forms.DateField(required=False, label='Date From', widget=forms.SelectDateWidget)
    date_to = forms.DateField(required=False, label='Date From', widget=forms.SelectDateWidget)

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super().__init__(*args, **kwargs)
        first_record_date = BaseConsult.objects.filter(created_by=user)[0].datetime.date()
        self.fields['date_from'].initial = first_record_date
        self.fields['date_to'].initial = timezone.localtime()


class ConsultHourFrequencyFilterForm(forms.Form):
    HOUR_RANGES_CHOICES = ((0, '0:00'), (1, '1:00'), (2, '2:00'), (3, '3:00'), (4, '4:00'), (5, '5:00'), (6, '6:00'), (7, '7:00'),
                           (8, '8:00'), (9, '9:00'), (10, '10:00'), (11, '11:00'), (12, '12:00'), (13, '13:00'), (14, '14:00'),
                           (15, '15:00'), (16, '16:00'), (17, '17:00'), (18, '18:00'), (19, '19:00'), (20, '20:00'), (21, '21:00'),
                           (22, '22:00'), (23, '23:00'))

    hour_from = forms.ChoiceField(required=False, label='Hour From', widget=forms.Select, initial=HOUR_RANGES_CHOICES[0], choices=HOUR_RANGES_CHOICES)
    hour_to = forms.ChoiceField(required=False, label='Hour To', widget=forms.Select, initial=HOUR_RANGES_CHOICES[-1], choices=HOUR_RANGES_CHOICES)