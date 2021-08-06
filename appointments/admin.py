from django.contrib import admin
from .models import BaseConsult, GeneralConsult, AllergyAndImmunologicalConsult, DentalConsult, NeurologicalConsult, \
                    GynecologicalConsult, OphthalmologyConsult, PsychiatryConsult, SurgicalConsult, UrologicalConsult,\
                    Icd10Group, Drug, MedicalTest, MedicalTestResult, Vaccine, VaccineApplication, Surgery

# Register your models here.

admin.site.register(BaseConsult)
admin.site.register(GeneralConsult)
admin.site.register(AllergyAndImmunologicalConsult)
admin.site.register(DentalConsult)
admin.site.register(NeurologicalConsult)
admin.site.register(GynecologicalConsult)
admin.site.register(OphthalmologyConsult)
admin.site.register(PsychiatryConsult)
admin.site.register(SurgicalConsult)
admin.site.register(UrologicalConsult)

admin.site.register(Vaccine)
admin.site.register(VaccineApplication)
admin.site.register(Surgery)
admin.site.register(Icd10Group)
admin.site.register(Drug)
admin.site.register(MedicalTest)
admin.site.register(MedicalTestResult)

