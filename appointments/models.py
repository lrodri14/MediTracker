"""
    DOCSTRING:
    This models.py file contains all the models used to create instances of CIE-10-Groups, Drugs, Medical exams and
    consults itself, this .py file is composed of four models.
"""

# Imports
from django.utils import timezone
from django.db import models
from patients.models import Patient
from django.contrib.auth import get_user_model
from utilities.appointments_utilities import STATUS_CHOICES, DRUG_CATEGORY_CHOICES, MEDICAL_TEST_CHOICES
# Getting the user model
user = get_user_model()

# Create your models here.


class Cie10Group(models.Model):
    """
        DOCSTRING:
        The Cie10Group modal is used to create CIE-10 code instances, it's composed of only one attribute, the code itself,
        we also created it's own __str__ dunder method representation, this mode overwrote it's save method, we added
        some functionality to capitalize the code once it reaches the database. It inherits from the models.Model class.
    """

    code = models.CharField('code', max_length=50, blank=False, null=True, help_text='CIE-10 Code')

    class Meta:
        verbose_name = 'CIE-10 Group'
        verbose_name_plural = 'CIE-10 Groups'

    def __str__(self):
        return self.code

    def save(self, *args, **kwargs):
        self.code = self.code.capitalize()
        super().save(*args, **kwargs)


class Drug(models.Model):
    """
        DOCSTRING:
        The Drug modal inherits from the models.Model class, it is used to create Drug instances as needed, this model
        defines a tuple under the variable CATEGORY_CHOICES, this choices are used to specify to what branch does this
        drug belongs, we added some functionality through the META CLASS indicating that the 'name' and 'created_by'
        are unique inside our instances, we also set our own __str__ dunder method and we overwrote the save method to
        capitalize the name of the drug every time it reaches the database.

        The operative method in the Drug model is used in the delete_drug view to check that this instance is used in
        any registers, if it is, then the delete operation will not be performed.
    """
    name = models.CharField('drug', max_length=200, blank=False, null=True, help_text='drugs name')
    category = models.CharField('category', max_length=50, blank=False, null=True, help_text='Category', choices=DRUG_CATEGORY_CHOICES)
    created_by = models.ForeignKey(user, on_delete=models.CASCADE, blank=True, null=True, help_text='Drug created by',
                                   related_name='drug', verbose_name='Created By')

    class Meta:
        unique_together = ['name', 'created_by']
        verbose_name = 'Drug'
        verbose_name_plural = 'Drugs'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.capitalize()
        super().save(*args, **kwargs)

    def operative(self, user):
        consults = BaseConsult.objects.filter(created_by=user)
        if consults:
            for c in consults:
                if self in c.drugs.all():
                    return True


class MedicalTest(models.Model):
    """
        DOCSTRING:
        The MedicalTest model inherits from the models.Model class, it is used to create MedicalTests instances as needed, this model
        defines a tuple under the variable MEDICAL_TEST_CHOICES, this choices are used to specify to what branch does this
        test belongs, we added some functionality through the META CLASS indicating that the 'test_type', 'name' and 'created_by'
        are unique inside our instances, we also set our own __str__ dunder method and we overwrote the save method to
        capitalize the name of the drug every time it reaches the database.

        The operative method in the MedicalTest model is used in the delete_test view to check that this instance is used in
        any registers, if it is, then the delete operation will not be performed.
    """

    test_type = models.CharField('Test Type', max_length=100, blank=False, null=True, help_text='Medical Test Type', choices=MEDICAL_TEST_CHOICES)
    name = models.CharField('Test Name', max_length=150, blank=False, null=True, help_text='Medical Test Name')
    created_by = models.ForeignKey(user, on_delete=models.CASCADE, blank=True, null=True, help_text='Created By', related_name='medical_test')

    def __str__(self):
        return self.name

    def operative(self, user):
        consults = BaseConsult.objects.filter(created_by=user)
        if consults:
            for c in consults:
                if self in c.testing.all():
                    return True

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ('name',)
        verbose_name = 'Medical Test'
        verbose_name_plural = 'Medical Tests'
        unique_together = ['test_type', 'name', 'created_by']


class Vaccine(models.Model):
    """
        DOCSTRING: This Vaccine model, inherits from the models.Model class, and it's used to create different vaccines,
        based on the user's needs. We overrode the save method and declared our own Meta class.
    """
    name = models.CharField('Name', max_length=100, blank=False, null=True, help_text='Vaccine name')
    scientific_name = models.CharField('Scientific Name', max_length=100, blank=True, null=True, help_text="Vaccine's scientific name")
    purpose = models.TextField('Purpose', blank=False, null=True, help_text="Vaccine's purpose")
    laboratory = models.CharField('Laboratory', max_length=100, blank=True, null=True, help_text='Laboratory')
    comments = models.TextField('Comments', blank=True, null=True, help_text='Comments about the vaccine')
    created_by = models.ForeignKey(user, on_delete=models.CASCADE, blank=True, null=True, help_text='Created_by', verbose_name='Created By', related_name='vaccine')

    def save(self, *args, **kwargs):
        self.name = self.name.capitalize()
        self.purpose = self.purpose.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name.upper()

    class Meta:
        verbose_name = 'Vaccine'
        verbose_name_plural = 'Vaccines'
        ordering = ('name',)


class Surgery(models.Model):
    """
        DOCSTRING: This Surgery model, inherits from models.Model class, and it's used to schedule different surgical
        procedures to patients. We overrode the save method and declared our own Meta class.
    """

    SURGERY_TYPE_CHOICES = (
        ('BAS', 'Bariatric Surgery'),
        ('BRS', 'Breast Surgery'),
        ('CRS', 'Colon and Rectal Surgery'),
        ('ES', 'Endocrine Surgery'),
        ('GS', 'General Surgery'),
        ('GYS', 'Gynecological Surgery'),
        ('HS', 'Hand Surgery'),
        ('HRS', 'Hernia Surgery'),
        ('NEUS', 'Neurological Surgery'),
        ('ORTS', 'Orthopedic Surgery'),
        ('OPHS', 'Ophthalmological Surgery'),
        ('OUTS', 'Outpatient Surgery'),
        ('PS', 'Pediatric Surgery'),
        ('PRS', 'Plastic and Reconstructive Surgery'),
        ('RS', 'Robotic Surgery'),
        ('THS', 'Thoracic Surgery'),
        ('TRS', 'Trauma Surgery'),
        ('US', 'Urological Surgery'),
        ('VS', 'Vascular Surgery'),
        ('MIS', 'Minimally Invasive Surgery'),
    )

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True, help_text='Patient receiving the surgery', related_name='surgery')
    datetime = models.DateTimeField('Datetime', blank=False, null=True, help_text='Surgery date and time')
    surgery_type = models.CharField(max_length=50, verbose_name='Type', blank=False, null=True, help_text='Surgery Type', choices=SURGERY_TYPE_CHOICES)
    about = models.TextField('About', blank=True, null=True, help_text='Information about the surgery')
    comments = models.TextField('Comments', blank=True, null=True, help_text='Surgery comments or important notes')
    status = models.CharField('Status', max_length=10, blank=True, null=True, help_text='Surgery status', choices=STATUS_CHOICES, default='OPEN')
    medical_status = models.BooleanField('Medical Status', blank=True, null=True, help_text='Medical Surgery Status', default=False)

    def __str__(self):
        return "{}'s {} surgery".format(str(self.patient), self.about)

    def save(self, *args, **kwargs):
        self.about = self.about.capitalize()
        self.comments = self.comments.capitalize()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Surgery'
        verbose_name_plural = 'Surgeries'
        ordering = ('datetime',)


class VaccineApplication(models.Model):
    """
        DOCSTRING: This VaccineApplication model inherits from models.Model and is used to relate different vaccine
        applications to patients. We overrode the save method and we declared our own Meta class.
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True, null=True, help_text='Patient receiving the surgery', related_name='vaccine')
    datetime = models.DateTimeField('Datetime', blank=False, null=True, help_text='Surgery date and time')
    vaccine_applied = models.ForeignKey(Vaccine, on_delete=models.CASCADE, blank=False, null=True, help_text='Vaccine Applied', verbose_name='Vaccine')
    comments = models.TextField('Comments', blank=True, null=True, help_text='Surgery comments or important notes')

    def __str__(self):
        return "{} - {}".format(str(self.patient), self.vaccine_applied)

    def save(self, *args, **kwargs):
        self.comments = self.comments.capitalize()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Vaccine applied'
        verbose_name_plural = 'Vaccines applied'
        ordering = ('-datetime',)


class BaseConsult(models.Model):
    """
        DOCSTRING:
        The BaseConsult class inherits from the models.Model class, and it serves as the base class to other consult types
        based on the user's speciality, we declared a tuple of choices which will establish in which state does the consult
        remains, the 'medical_status' attribute sets the status of the consult,to True if it was attended, and False if
        it was not, also the 'lock' attribute, is used to keep the consult active to further changes, until the lock
        attribute is set to True, then the consult will be closed and will never be able to be open again.
        We added some functionality, defining a META class, and set the unique_together attribute to 'patient' and
        'datetime' attributes, fianlly we created our own __str__ dunder method and rewrote the save method,
        capitalizing the 'motive' and 'suffering' attributes once they reach the database.
    """

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=False, null=True, verbose_name='Patient', help_text='Patient assisting this consult', related_name='consult')
    datetime = models.DateTimeField('Date & Time', blank=False, null=True, help_text='Date the consult will be done')
    motive = models.TextField('Motive', blank=False, null=True, help_text='The motive of your assistance to the consult')
    suffering = models.TextField('Suffering', blank=False, null=True, help_text='What is the patient suffering?')
    charge = models.DecimalField('Charges', blank=False, null=True, max_digits=10, decimal_places=2, help_text='Charge Amount')
    created_by = models.ForeignKey(user, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Created By')
    cie_10_group = models.OneToOneField(Cie10Group, on_delete=models.CASCADE, blank=True, null=True, help_text='CIE-10 group for the diagnose', verbose_name='CIE-10 Group')
    cie_10_detail = models.TextField('CIE-10 Detail', blank=True, null=True, help_text='CIE-10 Diagnose Details')
    diagnose = models.TextField('Diagnose', blank=True, null=True, help_text='Diagnose')
    procedure = models.TextField('Procedure', blank=True, null=True, help_text='Procedure')
    analysis = models.TextField('Analysis', blank=True, null=True, help_text='Analysis')
    notes = models.TextField('Notes', blank=True, null=True, help_text='Notes')
    drugs = models.ManyToManyField(Drug, blank=True, help_text='Drugs recommended', verbose_name='Drugs')
    indications = models.TextField('Indications', blank=True, null=True, help_text='Indications')
    actions = models.TextField('Actions', blank=True, null=True, help_text='Actions')
    prescription = models.FileField('Prescription', blank=True, null=True, help_text="Prescription", upload_to='appointments/prescriptions')
    testing = models.ManyToManyField(MedicalTest, blank=True, help_text='Pending Testing', verbose_name='Testing')
    instructions = models.CharField(max_length=512, blank=True, null=True, help_text='Instructions', verbose_name='Instructions')
    medical_status = models.BooleanField('Medical Status', blank=True, null=True, help_text='Handles the medical consult status', default=False)
    status = models.CharField('Status', max_length=10, blank=True, null=True, help_text='Handles the consult status', default=STATUS_CHOICES[0][0], choices=STATUS_CHOICES)
    lock = models.BooleanField('Lock', default=True, blank=False, null=True, help_text='Consult lock status')

    def __str__(self):
        return str(self.patient) + "'s consult for " + str(self.datetime)

    def save(self, *args, **kwargs):
        self.motive = self.motive.capitalize()
        self.suffering = self.suffering.capitalize()
        super().save(*args, **kwargs)

    def generate_message(self):
        first_names = self.patient.first_names
        last_names = self.patient.last_names
        date = self.datetime.date()
        time = self.datetime.time().strftime('%I:%M %p')
        message = 'Dear Mr/Mrs. {} {}, \nyou have a pending appointment in {} at {}'.format(first_names, last_names, date, time)
        return message

    class Meta:
        unique_together = ['created_by', 'datetime']
        verbose_name = 'Consult'
        verbose_name_plural = 'Consults'
        ordering = ('datetime',)


class GeneralConsult(BaseConsult):
    """
        DOCSTRING: The GeneralConsult class inherits from BaseConsults, this class is used to create consults for users
        with the "GENERAL MEDICINE", "INTERNAL MEDICINE" or "PEDIATRICS" speciality, it declares it's own Meta class.
    """
    blood_pressure = models.CharField('Blood Pressure', max_length=10, blank=True, null=True, help_text='Blood Pressure')
    temperature = models.FloatField('Temperature', blank=True, null=True, help_text='Corporal Temperature')
    weight = models.FloatField('Weight', blank=True, null=True, help_text='Weight')
    size = models.FloatField('Height', blank=True, null=True, help_text='Size')
    digestive_system = models.TextField('Digestive System', blank=True, null=True, help_text='Digestive System Analysis')
    endocrine_system = models.TextField('Endocrine System', blank=True, null=True, help_text='Endocrine System Analysis')
    renal_system = models.TextField('Renal System', blank=True, null=True, help_text='Renal System Analysis')
    lymphatic_system = models.TextField('Lymphatic System', blank=True, null=True, help_text='Lymphatic System Analysis')
    respiratory_system = models.TextField('Respiratory System', blank=True, null=True, help_text='Respiratory System Analysis')
    head_exploration = models.TextField('Head Exploration', blank=True, null=True, help_text='Head Exploration Analysis')
    thorax_exploration = models.TextField('Thorax Exploration', blank=True, null=True, help_text='Thorax Exploration Analysis')

    class Meta:
        verbose_name = 'General Consult'
        verbose_name_plural = 'General Consults'


class AllergyAndImmunologicalConsult(BaseConsult):
    """
        DOCSTRING: The AllergyAndImmunologicalConsult class inherits from BaseConsult, and is used to create consults for
        users with "ALLERGY AND IMMUNOLOGY" speciality, it overwrites the save method and declares it's own Meta Class.
    """
    general_notes = models.TextField('General Notes', blank=True, null=True, help_text='Consult General Notes')

    class Meta:
        verbose_name = 'Allergy and Immunological Consult'
        verbose_name_plural = 'Allergy and Immunological Consults'


class DentalConsult(BaseConsult):
    """
        DOCSTRING: The DentalConsult class inherits from BaseConsult, and is used to create consults for
        users with "DENTIST" speciality, it overwrites the save method and declares it's own Meta Class.
    """
    general_notes = models.TextField('General Notes', blank=True, null=True, help_text='Consult General Notes')

    class Meta:
        verbose_name = 'Dental Consult'
        verbose_name_plural = 'Dental Consults'


class NeurologicalConsult(BaseConsult):
    """
        DOCSTRING: The NeurologicalConsult class inherits from BaseConsult, and is used to create consults for
        users with "NEUROLOGY" speciality, it overwrites the save method and declares it's own Meta Class.
    """
    general_notes = models.TextField('General Notes', blank=True, null=True, help_text='Consult General Notes')

    class Meta:
        verbose_name = 'Neurological Consult'
        verbose_name_plural = 'Neurological Consults'


class GynecologicalConsult(BaseConsult):
    """
        DOCSTRING: The GynecologicalConsult class inherits from BaseConsult, and is used to create consults for
        users with "OBSTETRICS AND GYNECOLOGY" speciality, it overwrites the save method and declares it's own Meta Class.
    """
    general_notes = models.TextField('General Notes', blank=True, null=True, help_text='Consult General Notes')

    class Meta:
        verbose_name = 'Gynecological Consult'
        verbose_name_plural = 'Gynecological Consults'


class OphthalmologyConsult(BaseConsult):
    """
        DOCSTRING: The OphthalmologyConsult class inherits from BaseConsult, and is used to create consults for
        users with "OPHTHALMOLOGY" speciality, it overwrites the save method and declares it's own Meta Class.
    """
    general_notes = models.TextField('General Notes', blank=True, null=True, help_text='Consult General Notes')

    class Meta:
        verbose_name = 'Ophthalmology Consult'
        verbose_name_plural = 'Ophthalmology Consults'


class PsychiatryConsult(BaseConsult):
    """
        DOCSTRING: The PsychiatryConsult class inherits from BaseConsult, and is used to create consults for
        users with "PSYCHIATRY" speciality, it overwrites the save method and declares it's own Meta Class.
    """
    general_notes = models.TextField('General Notes', blank=True, null=True, help_text='Consult General Notes')

    class Meta:
        verbose_name = 'Psychiatry Consult'
        verbose_name_plural = 'Psychiatry Consults'


class SurgicalConsult(BaseConsult):
    """
        DOCSTRING: The SurgicalConsult class inherits from BaseConsult, and is used to create consults for
        users with "SURGERY" speciality, it overwrites the save method and declares it's own Meta Class.
    """
    general_notes = models.TextField('General Notes', blank=True, null=True, help_text='Consult General Notes')

    class Meta:
        verbose_name = 'Surgical Consult'
        verbose_name_plural = 'Surgical Consults'


class UrologicalConsult(BaseConsult):
    """
        DOCSTRING: The UrologicalConsult class inherits from BaseConsult, and is used to create consults for
        users with "UROLOGY" speciality, it overwrites the save method and declares it's own Meta Class.
    """
    general_notes = models.TextField('General Notes', blank=True, null=True, help_text='Consult General Notes')

    class Meta:
        verbose_name = 'Urological Consult'
        verbose_name_plural = 'Urological Consults'


class MedicalTestResult(models.Model):

    """
        DOCSTRING:
        The MedicalExam model inherits from the models.Model class and is used to create exams instances, we defined a
        tuple of choices under the name of EXAMS_CHOICES, used to indicate what type of exam we are creating, we also
        created our own dunder __str__ dunder method.
    """

    consult = models.ForeignKey(BaseConsult, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Consult', help_text='Medical Exams', related_name='exam')
    date = models.DateField('date', blank=True, null=True, help_text='Date the exams were presented')
    type = models.CharField('type of exams', max_length=100, blank=False, null=True, help_text='Type of exams', choices=MEDICAL_TEST_CHOICES)
    image = models.ImageField('exam', blank=True, null=True, help_text='Exam IMG', upload_to='appointments/exams')

    class Meta:
        verbose_name = 'Medical Test Result'
        verbose_name_plural = 'Medical Test Results'

    def __str__(self):
        return str(self.type) + ' ' + str(self.date)

    def save(self, *args, **kwargs):
        self.date = timezone.localtime()
        super().save(*args, **kwargs)
