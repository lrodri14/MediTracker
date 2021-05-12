"""
    DOCSTRING:
    This forms.py file contains all the forms classes to create, update, delete, and filter instances inside the appoint-
    ments app.
"""

# Imports
from django import forms
from datetime import timedelta
from django.utils import timezone
from dateutil import relativedelta
from patients.models import Patient
from django.forms import inlineformset_factory
from django.core.exceptions import ValidationError
from utilities.appointments_utilities import MEDICAL_TEST_CHOICES
from .models import BaseConsult, GeneralConsult, AllergyAndImmunologicalConsult, DentalConsult, NeurologicalConsult,\
                    GynecologicalConsult, OphthalmologyConsult, PsychiatryConsult, SurgicalConsult, UrologicalConsult,\
                    MedicalTest, MedicalTestResult, Drug, Vaccine, VaccineApplication, Surgery

# Creation Forms


class BaseConsultCreationForm(forms.ModelForm):
    """
        DOCSTRING:
        This BaseConsultCreationFOrm class, inherits from the ModelForm class, and serves as a base of creation model forms,
        we overwrote the __init__ method, because we need some extra parameters to perform some functionality inside our
        forms, we need the current user to set the select optionsinside our 'patient' attribute, we also overwrote the
        clean method to perform some extra cleaning inside 'datetime' model attribute, every time the datetime input is
        before the current date and time the form will raise an error indicating, the 'datetime' value can not be before
        the current time.
    """
    datetime = forms.DateTimeField(input_formats=['%Y-%m-%dT%H:%M'], widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'), initial=timezone.localtime(timezone.now()))

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super().__init__(*args, **kwargs)
        self.fields['patient'].queryset = Patient.objects.filter(created_by=user)

    def clean(self):
        cleaned_data = super().clean()
        datetime = cleaned_data.get('datetime')
        if datetime < (timezone.localtime() - timedelta(hours=0, minutes=1)):
            raise ValidationError('Unable to create a consult for this date and time', code='invalid_date')
        return cleaned_data

    class Meta:
        model = BaseConsult
        fields = ('patient', 'datetime', 'motive', 'suffering',)
        widgets = {
            'motive': forms.Textarea(attrs={'rows': 8, 'columns': 5}),
            'suffering': forms.Textarea(attrs={'rows': 8, 'columns': 5})
        }


class GeneralConsultCreationForm(BaseConsultCreationForm):

    """
        This GeneralConsultCreationForm class is used to create General Consult Form instances,
        it inherits from the BaseConsultCreationForm class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = GeneralConsult


class AllergyAndImmunologicalConsultCreationForm(BaseConsultCreationForm):

    """
        This AllergyAndImmunologicalConsultCreationForm class is used to create Allergy and Immunological Consult Form instances,
        it inherits from the BaseConsultCreationForm class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = AllergyAndImmunologicalConsult


class DentalConsultCreationForm(BaseConsultCreationForm):
    """
        This DentalConsultCreationForm class is used to create Dental Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = DentalConsult


class NeurologicalConsultCreationForm(BaseConsultCreationForm):
    """
        This NeurologicalConsultCreationForm class is used to create Neurological Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = NeurologicalConsult


class GynecologicalConsultCreationForm(BaseConsultCreationForm):
    """
        This GynecologicalConsultCreationForm class is used to create Gynecological Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = GynecologicalConsult


class OphthalmologyConsultCreationForm(BaseConsultCreationForm):
    """
        This OphthalmologyConsultCreationForm class is used to create Ophthalmology Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = OphthalmologyConsult


class PsychiatryConsultCreationForm(BaseConsultCreationForm):
    """
        This PsychiatryConsultCreationForm class is used to create Psychiatry Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = PsychiatryConsult


class SurgicalConsultCreationForm(BaseConsultCreationForm):
    """
        This SurgicalConsultCreationForm class is used to create Surgical Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = SurgicalConsult


class UrologicalConsultCreationForm(BaseConsultCreationForm):
    """
        This UrologicalConsultCreationForm class is used to create Urological Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(BaseConsultCreationForm.Meta):
        model = UrologicalConsult


# Updating Forms


class UpdateBaseConsultForm(forms.ModelForm):
    """
        DOCSTRING: This UpdateConsultForm serves as the base model to the different speciality specific forms, this model
        overrides the __init__ method by specifying the drugs that will be displayed in the choices, and we set a clean
        method that checks if the CIE detail is complete, as well as our Meta class.
    """

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super().__init__(*args, **kwargs)
        self.fields['drugs'].queryset = Drug.objects.filter(created_by=user)

    def clean(self):
        cleaned_data = super().clean()
        cie_group = cleaned_data.get('cie_10_group')
        cie_detail = cleaned_data.get('cie_10_detail')
        if (cie_group and not cie_detail) or (cie_detail and not cie_group):
            raise ValidationError("CIE-10 diagnose details incomplete", code='invalid_cie_10_details')
        return cleaned_data

    class Meta:
        model = BaseConsult
        exclude = ('patient', 'datetime', 'motive', 'suffering', 'created_by', 'status', 'medical_status', 'prescription')
        widgets = {
            'charge': forms.NumberInput(attrs={'placeholder': '0.00'}),
            'general_notes': forms.Textarea(attrs={'rows': 20, 'columns': 120}),
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


class UpdateGeneralConsultForm(UpdateBaseConsultForm):
    """
        DOCSTRING:
        UpdateGeneralConsultForm class inherits from the UpdateBaseConsultForm class, and is used to create Update General Consult Form instances,
        we defined our META Class to add functionality to our class, we created a dictionary containing all the
        widgets needed for our input fields.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = GeneralConsult


class UpdateAllergyAndImmunologicalConsultForm(UpdateBaseConsultForm):

    """
        This AllergyAndImmunologicalConsultCreationForm class is used to create Allergy and Immunological Consult Form instances,
        it inherits from the BaseConsultCreationForm class and declares it's own Meta class.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = AllergyAndImmunologicalConsult


class UpdateDentalConsultForm(UpdateBaseConsultForm):
    """
        This DentalConsultCreationForm class is used to create Dental Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = DentalConsult


class UpdateNeurologicalConsultForm(UpdateBaseConsultForm):
    """
        This NeurologicalConsultCreationForm class is used to create Neurological Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = NeurologicalConsult


class UpdateGynecologicalConsultForm(UpdateBaseConsultForm):
    """
        This GynecologicalConsultCreationForm class is used to create Gynecological Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = GynecologicalConsult


class UpdateOphthalmologyConsultForm(UpdateBaseConsultForm):
    """
        This OphthalmologyConsultCreationForm class is used to create Ophthalmology Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = OphthalmologyConsult


class UpdatePsychiatryConsultForm(UpdateBaseConsultForm):
    """
        This PsychiatryConsultCreationForm class is used to create Psychiatry Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = PsychiatryConsult


class UpdateSurgicalConsultForm(UpdateBaseConsultForm):
    """
        This SurgicalConsultCreationForm class is used to create Surgical Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = SurgicalConsult


class UpdateUrologicalConsultForm(UpdateBaseConsultForm):
    """
        This UrologicalConsultCreationForm class is used to create Urological Consult Form instances, it inherits from the BaseConsultCreationForm
        class and declares it's own Meta class.
    """

    class Meta(UpdateBaseConsultForm.Meta):
        model = UrologicalConsult


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


MedicalTestResultFormset = inlineformset_factory(parent_model=BaseConsult, model=MedicalTestResult, form=MedicalTestResultForm, can_delete=True, extra=1)

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
    date_from = forms.DateField(widget=forms.SelectDateWidget(years=years), initial=timezone.now() - relativedelta.relativedelta(months=3))
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


class VaccineCreationAndUpdateForm(forms.ModelForm):

    """
        DOCSTRING: This VaccineCreationAndUpdateForm is used to create and update Vaccine instances.
    """

    class Meta:
        model = Vaccine
        exclude = ('created_by',)


class SurgeryCreationAndUpdateForm(forms.ModelForm):

    """
        DOCSTRING: This SurgeryCreationAndUpdateForm is used to create and update Surgery instances.
    """

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super().__init__(*args, **kwargs)
        self.fields['patient'].queryset = Patient.objects.filter(created_by=user)

    class Meta:
        model = Surgery
        exclude = ('created_by',)


class VaccineApplicationCreationAndUpdateForm(forms.ModelForm):

    """
        DOCSTRING: This VaccineApplicationCreationAndUpdateForm is used to create and update VaccineApplication instances.
    """

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super().__init__(*args, **kwargs)
        self.fields['patient'].queryset = Patient.objects.filter(created_by=user)

    class Meta:
        model = VaccineApplication
        fields = '__all__'
