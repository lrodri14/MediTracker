from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import UsersProfile


class TestUserModel(TestCase):

    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(username='luisadolfo', password='bmwm3e46', first_name='luis', last_name='rodriguez', roll='Doctor', speciality='UROLOGY')
        self.user_profile = UsersProfile.objects.get(user=self.user)

    def test_names(self):
        self.assertEqual(self.user.first_name, 'Luis')
        self.assertEqual(self.user.last_name, 'Rodriguez')

    def test_created_user_profile(self):
        user = self.user
        created_profile = UsersProfile.objects.get(user=user)
        self.assertEqual(created_profile.user, user)


class TestUserProfileModel(TestCase):

    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(username='luisadolfo', password='bmwm3e46', first_name='luis',
                                                   last_name='rodriguez', roll='DOCTOR', speciality='UROLOGY')

    def test_existence_of_profile_created(self):
        profile = UsersProfile.objects.get(user=self.user)
        self.assertEqual(profile.user, self.user)



