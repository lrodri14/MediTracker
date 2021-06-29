from django import forms
from django.utils import timezone
from django.contrib.auth import get_user_model


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
        self.fields['age_to'].initial = 11


class GenderDistributionFilterForm(forms.Form):

    GENDER_CHOICES = (
        ('all', '----------'),
        ('F', 'Femenine'),
        ('M', 'Masculine')
    )

    gender = forms.ChoiceField(required=False, label='Gender', widget=forms.Select, choices=GENDER_CHOICES)


