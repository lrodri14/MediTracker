import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meditracker.settings')
django.setup()

import random
from faker import Faker
from patients.models import Patient
from django.utils import timezone
from django.contrib.auth import get_user_model

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


if __name__ == '__main__':
    Patient.objects.all().delete()
    print('Populating database')
    populate_patients(1000)
    print('Population finished')

