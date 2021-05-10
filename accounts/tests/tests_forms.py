from django.test import SimpleTestCase, TestCase
from ..forms import SignUpForm, ProfileForm

class TestSignUpForm(TestCase):

    def test_valid_data(self):
        form = SignUpForm(data={
            'username': 'lrodri16',
            'first_name': 'luis',
            'last_name': 'rodriguez',
            'email': 'adolfo123@gmail.com',
            'password1': 'bmwm3e46',
            'password2': 'bmwm3e46',
            'roll': 'DOCTOR',
            'speciality': 'UROLOGY'
        })

        self.assertTrue(form.is_valid())

    def test_invalid_data(self):
        form = SignUpForm(data={
            'username': 'lrodri14',
            'first_name': 'luis',
            'last_name': 'rodriguez',
            'email': 'adolfo123gmail.com',
            'password1': 'bmwm3e46',
            'password2': 'bmwbmwmw',
            'roll': 'DOCTOR',
            'speciality': 'UROLOGY'
        })
        self.assertEqual(len(form.errors), 2)


class TestProfileForm(TestCase):
    def setUp(self):
        self.valid_data = ProfileForm(data={
            'gender': 'Masculine',
            'origin': 'Honduras',
            'location': 'Honduras',
            'address': 'Choluteca'
        })

        self.invalid_data = ProfileForm(data={
            'gender': 'Masculine',
        })

    def test_valid_form(self):
        form = self.valid_data
        self.assertTrue(form.is_valid)

    def test_valid_form(self):
        form = self.invalid_data
        self.assertEqual(len(form.errors), 3)