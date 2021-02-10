"""
    DOCSTRING:
    This forms.py file contains all the forms classes to create, update, delete, and filter instances inside the appoint-
    ments app.
"""

# Imports
from datetime import timedelta
from django.core.exceptions import ValidationError
from .models import Consult, MedicalTest, MedicalTestResult, Drug
from django import forms
from django.forms import modelformset_factory, inlineformset_factory
from django.utils import timezone
from dateutil import relativedelta
from patients.models import Patient
from utilities.appointments_utilities import MEDICAL_TEST_CHOICES


class ConsultForm(forms.ModelForm):
    """
        DOCSTRING:
        This ConsultForm class, inherits from the ModelForm class, and is used to the create Consults Forms
        instances, we overwrote the __init__ method, because we need some extra parameters to perform some
        functionality inside our forms, we need the current user to set the select options
        inside our 'patient' attribute, we also overwrote the clean method to perform some extra
        cleaning inside 'datetime' model attribute, every time the datetime input is before the current date and time
        the form will raise an error indicating, the 'datetime' value can not be before the current time.
    """
    datetime = forms.DateTimeField(input_formats=['%Y-%m-%dT%H:%M'], widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'), initial=timezone.localtime(timezone.now()))

    class Meta:
        model = Consult
        fields = ('patient', 'datetime', 'motive', 'suffering',)
        widgets = {
            'motive': forms.Textarea(attrs={'rows': 8, 'columns': 5}),
            'suffering': forms.Textarea(attrs={'rows': 8, 'columns': 5})
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(ConsultForm, self).__init__(*args, **kwargs)
        self.fields['patient'].queryset = Patient.objects.filter(created_by=self.user)

    def clean(self):
        cleaned_data = super().clean()
        datetime = cleaned_data.get('datetime')
        if datetime < (timezone.localtime() - timedelta(hours=0, minutes=1)):
            raise ValidationError('Unable to create a consult for this date and time', code='invalid_date')
        return cleaned_data


class UpdateConsultForm(forms.ModelForm):
    """
        DOCSTRING:
        UpdateConsultForm class inherits from the forms.ModelForm class, and is used to create UpdateConsultsForm instances,
        we defined our META Class to add functionality to our class, we created a dictionary containing all the
        widgets needed for our input fields, we overwrote the __init__ method to provide some extra functionality
        to our forms, we need the current user to set the select options of the drug fields, they must be only drugs created
        by the user, finally we overwrote the clean method to do some extra cleaning in our forms, they will check thay
        all the diagnose data is completed, nothing left behind.
    """

    class Meta:
        model = Consult
        exclude = ('patient', 'datetime', 'motive', 'suffering', 'created_by', 'status', 'medical_status', 'prescription')
        widgets = {
            'charge': forms.NumberInput(attrs={'placeholder': '0.00'}),
            'digestive_system': forms.Textarea(attrs={'rows': 2, 'cols': 70}),
            'endocrine_system': forms.Textarea(attrs={'rows': 2, 'cols': 70}),
            'lymphatic_system': forms.Textarea(attrs={'rows': 2, 'cols': 70}),
            'respiratory_system': forms.Textarea(attrs={'rows': 2, 'cols': 70}),
            'renal_system': forms.Textarea(attrs={'rows': 2, 'cols': 70}),
            'head_exploration': forms.Textarea(attrs={'rows': 2, 'cols': 70}),
            'thorax_exploration': forms.Textarea(attrs={'rows': 2, 'cols': 70}),
            'cie_10_detail': forms.Textarea(attrs={'rows': 2, 'cols': 150}),
            'diagnose': forms.Textarea(attrs={'rows': 2, 'cols': 150}),
            'procedure': forms.Textarea(attrs={'rows': 2, 'cols': 150}),
            'analysis': forms.Textarea(attrs={'rows': 2, 'cols': 150}),
            'notes': forms.Textarea(attrs={'rows': 2, 'cols': 150}),
            'drugs': forms.CheckboxSelectMultiple(),
            'indications': forms.Textarea(attrs={'rows': 5, 'cols': 10, 'placeholder': 'Indications Here'}),
            'actions': forms.Textarea(attrs={'rows': 5, 'cols': 10, 'placeholder': 'Extra Considerations (Optional)'}),
            'testing': forms.CheckboxSelectMultiple(),
            'instructions': forms.Textarea(attrs={'rows': 5, 'cols': 10, 'placeholder': 'Medical Testing Instructions (Optional)'}),
            'lock': forms.widgets.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(UpdateConsultForm, self).__init__(*args, **kwargs)
        self.fields['drugs'].queryset = Drug.objects.filter(created_by=user)

    def clean(self):
        cleaned_data = super().clean()
        cie_group = cleaned_data.get('cie_10_group')
        cie_detail = cleaned_data.get('cie_10_detail')
        if (cie_group and not cie_detail) or (cie_detail and not cie_group):
            raise ValidationError("CIE-10 diagnose details incomplete", code='invalid_cie_10_details')
        return cleaned_data


class MedicalTestResultForm(forms.ModelForm):
    """
        DOCSTRING:
        MedicalExamForm class inherits from forms.ModelForm class, and is used to create MedicalExamsForm instances,
        we defined our Meta Class as usual indicating the model and the fields to display in our form, we overwrote the
        the clean method to perform some extra cleaning in our forms, the form will return an error if the
        exams information is incomplete. This class will not be used as a single form, we used modelformsets, so the
        user can add as many forms as needed.
    """

    class Meta:
        model = MedicalTestResult
        fields = ('type', 'image',)

    def clean(self):
        cleaned_data = super().clean()
        exam_type = cleaned_data.get('type')
        image = cleaned_data.get('image')
        if (exam_type and not image) or (image and not exam_type):
            raise ValidationError("Both 'Type' and 'Image' fields must be provided", code='invalid_exams')
        return cleaned_data


MedicalTestResultFormset = inlineformset_factory(parent_model=Consult, model=MedicalTestResult, form=MedicalTestResultForm, can_delete=True, extra=1)

# Range of years displayed in the filter forms.


years = [y for y in range(1920, timezone.now().year+2)]


class RecordsDateFilterForm(forms.Form):
    """
        DOCSTRING:
        The RecordsDateFilterForm inherits from forms.Form class and is used to filter records and display them
        dynamically in our template, it holds only two attributes: 'date_from' and 'date_to'
    """
    date_from = forms.DateField(widget=forms.SelectDateWidget(years=years), initial=timezone.now() - relativedelta.relativedelta(month=3))
    date_to = forms.DateField(widget=forms.SelectDateWidget(years=years), initial=timezone.now())


class AgendaDateFilterForm(forms.Form):
    """
        DOCSTRING:
        The AgendaDateFilterForm inherits from forms.Form class and is used to agenda scheduled consults and display them
        dynamically in our template, it holds only two attributes: 'date_from' and 'date_to'
    """
    date_from = forms.DateField(widget=forms.SelectDateWidget(years=years), initial=timezone.now())
    date_to = forms.DateField(widget=forms.SelectDateWidget(years=years), initial=timezone.now())


class ConsultDetailsFilterForm(forms.Form):
    """
        DOCSTRING:
        The ConsultDetailsFilterForm inherits from forms.Form class and is used to consults records and display them
        dynamically in our template, it holds only two attributes: 'date_from' and 'date_to'
    """
    date_from = forms.DateField(widget=forms.SelectDateWidget(years=years), initial=timezone.now())
    date_to = forms.DateField(widget=forms.SelectDateWidget(years=years), initial=timezone.now())

# Tuple Holding all the months displayed in the Registers Filter Form


MONTH_CHOICES = (
    (0, '-------'),
    (1, 'January'),
    (2, 'February'),
    (3, 'March'),
    (4, 'April'),
    (5, 'May'),
    (6, 'June'),
    (7, 'July'),
    (8, 'August'),
    (9, 'September'),
    (10, 'October'),
    (11, 'November'),
    (12, 'December'),
)

# Tuple Holding all the years displayed in the Registers Filter Form


YEARS_CHOICES = (
    (i, i) for i in range(1920, timezone.now().year+2)
)


class RegisterFilterForm(forms.Form):
    """
        DOCSTRING:
        The RegisterFilterForm class, inherits from the forms.Form class and is used to instance filter forms for the
        Registers, it contains only three attributes, 'patient', 'month' and 'year', the two last ones make use of the
        choices we defined at the top.
    """
    patient = forms.CharField(max_length=100, widget=forms.TextInput, required=False)
    month = forms.ChoiceField(choices=MONTH_CHOICES, required=False)
    year = forms.ChoiceField(choices=YEARS_CHOICES, required=False)


class DrugCategoryFilterForm(forms.Form):

    """
        DOCSTRING:
        The DrugCategoryFilterForm inherits from forms.Form class and is used to filter drugs based on a query, we defined
        a tuple under the variable named CATEGORY_CHOICES , this contains all the possible choices in which we can query
        our drugs, we also rewrote the __init__ method to perform some extra functionality, the category filter may be
        not required, so we set the required attribute to false.
    """

    CATEGORY_CHOICES = (
        ('', '---------'),
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

    category = forms.CharField(max_length=50,  widget=forms.Select(choices=CATEGORY_CHOICES))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['category'].required = False


class DrugForm(forms.ModelForm):
    """
        DOCSTRING:
        The DrugForm inherits from the models.ModelForm class, it is used to create DrugsForm form instances,
        we defined it's META class as usual, defining the model to create the form for, and the fields we want the
        form to display.
    """

    class Meta:
        model = Drug
        exclude = ('created_by',)


class DrugFilterForm(forms.Form):
    """
        DOCSTRING:
        The DrugFilterForm is used to filter drugs and display them dynamically in our template.
    """
    name = forms.CharField(label='Name', required=False)


class MedicalTestForm(forms.ModelForm):
    """
        DOCSTRING:
        The MedicalTestForm inherits from the models.ModelForm class, it is used to create MedicalTest form instances,
        we defined it's META class as usual, defining the model to create the form for, and the fields we want the
        form to display.
    """
    class Meta:
        model = MedicalTest
        exclude = ('created_by',)


class MedicalTestFilterForm(forms.Form):
    """
        DOCSTRING:
        The MedicalTestFilterForm form inherits form the forms.Form class, and it is used to filter Medical Tests
        data from the server side.
    """
    name = forms.CharField(widget=forms.TextInput)


class MedicalTestTypeFilterForm(forms.Form):
    """
        DOCSTRING:
        The MedicalTestFilterForm is used to filter medical tests and display them dynamically in our template.
    """
    test_type = forms.CharField(label='Test Type', required=False, widget=forms.Select(choices=MEDICAL_TEST_CHOICES))


