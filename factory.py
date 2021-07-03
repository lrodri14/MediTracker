import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meditracker.settings')
django.setup()

import random
from faker import Faker
from patients.models import Patient, InsuranceInformation
from appointments.models import BaseConsult
from django.utils import timezone
from django.contrib.auth import get_user_model
import pytz

faker = Faker()
genders = ['M', 'F']
civil_status = ['S', 'M']
origin_res = ['HN', 'US', 'MX', 'AR', 'BR', 'BZ', 'NI', 'PA', 'SV', 'CA', 'CL', 'CO', 'CR', 'GT']
user = get_user_model().objects.get(username='lrodri14')


def populate_patients(iters=5):
    for i in range(iters):
        Patient.objects.create(
            first_names=faker.first_name(),
            last_names=faker.last_name(),
            gender=random.choice(genders),
            birthday=faker.date_between(start_date="-100y", end_date=timezone.localtime().date()),
            civil_status=random.choice(civil_status),
            origin=random.choice(origin_res),
            residence=random.choice(origin_res),
            date_created=faker.date_between(start_date="-8y", end_date=timezone.localtime().date()),
            created_by=user
            )


def populate_consults(iters=5):
    patients = Patient.objects.filter(created_by=user)
    for i in range(iters):
        BaseConsult.objects.create(
            patient=random.choice(list(patients)),
            datetime=faker.date_time_between(tzinfo=pytz.timezone('America/Tegucigalpa'), start_date='-180d', end_date=timezone.localtime()),
            motive=faker.paragraph(),
            suffering=faker.paragraph(),
            charge=faker.random_int(min=200, max=500),
            status=random.choice(['OPEN', 'CONFIRMED', 'CANCELLED', 'CLOSED']),
            medical_status=random.choice([True, False]),
            created_by=user
        )


if __name__ == '__main__':
    print('Populating database')
    populate_consults(300)
    print('Population finished')



