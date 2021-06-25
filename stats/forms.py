from django import forms


class PatientsVisualizationForm(forms.Form):

    VISUALIZATION_CHOICES = (
        ('GENDERS', 'Gender Distribution'),
    )

    data_displayed = forms.MultipleChoiceField(choices=VISUALIZATION_CHOICES, widget=forms.CheckboxSelectMultiple)
    date_from = forms.DateField(label='Date From')
    date_to = forms.DateField(label='Date To')


