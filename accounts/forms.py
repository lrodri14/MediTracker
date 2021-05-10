"""
    This forms.py file contains all the form classes needed to edit user profile information or to create any user
    instances.
"""

from django import forms
from django.contrib.auth.forms import UserCreationForm as CreationForm
from django.contrib.auth.forms import UserChangeForm as ChangeForm
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import CustomUser, Doctor, Assistant, UsersProfile, UserAccountSettings, UserGeneralSettings, MailingCredential
from PIL import Image, ExifTags
import pytz


class UserCreationForm(CreationForm):
    """
        DOCSTRING:
        This UserCreationForm class form is used to create any user instances, this form inherits from UserCreationForm,
        a form used for user creation. We defined it's Meta Class with the model attribute aiming to our CustomUser class.
    """
    class Meta(CreationForm.Meta):
        model = CustomUser


class UserChangeForm(ChangeForm):
    """
        DOCSTRING:
        This UserChangeFOrm class form is used to edit any user instances, this form inherits from UserChangeForm,
        a form used for user editing. We defined it's Meta Class with the model attribute aiming to our CustomUser class.
    """
    password = ReadOnlyPasswordHashField

    class Meta(ChangeForm.Meta):
        model = CustomUser


class DoctorSignUpForm(CreationForm):
    """
        DOCSTRING:
        This DoctorSignUpForm is used to create user instances which roll is 'DOCTOR', this class inherits from the
        UserCreationForm class, we defined it's Meta Class with it's fields attribute used to include specific fields
        from the original class we will be aiming to, we also rewrote our own __init__ method setting 'required' attribute
        to True.
    """
    class Meta:
        model = Doctor
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'speciality')
        widgets = {
            'email': forms.widgets.EmailInput(),
            'speciality': forms.widgets.Select()
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        self.fields['email'].required = True
        self.fields['speciality'].required = True


class AssistantSignUpForm(CreationForm):
    """
        DOCSTRING:
        This AssistantSignUpForm is used to create user instances which roll is 'ASSISTANT', this class inherits from the
        UserCreationForm class, we defined it's Meta Class with it's fields attribute used to include specific  fields
        from the original class we will be aiming to, we also rewrote our own __init__ method setting 'required' attribute
        to True.
    """
    class Meta:
        model = Assistant
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')
        widgets = {
            'email': forms.widgets.EmailInput(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        self.fields['email'].required = True


class AddLinkingForm(forms.Form):
    """
        DOCSTRING: The AddLinkingForm is used by the assistant to create links between his/her account to Doctor's accounts
    """
    linking_id = forms.CharField(label='Linking ID', max_length=14, required=True, widget=forms.TextInput(attrs={'placeholder': 'XXXX-XXXX-XXXX'}))


class ProfileForm(forms.ModelForm):
    """
        DOCSTRING:
        This ProfileForm class inherits from the forms.ModelForm class, and it's used to update the user's profile,
        we defined it's meta class with the model attribute aiming to the UsersProfile class and we also defined our
        exclude attribute as well as our widgets attribute.
    """

    class Meta:
        model = UsersProfile
        exclude = ('user', 'profile_pic', 'background_pic', 'contacts')
        widgets = {
            'address': forms.widgets.Textarea(attrs={'rows': 1, 'wrap': 'off'}),
            'birth_date': forms.widgets.SelectDateWidget(years=[x for x in range(1920, 2101)]),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['availability'].required = False


class ChangeAvailabilityForm(forms.ModelForm):
    """
        This ChangeAvailabilityForm inherits from the ModelForm class, and it's used to change the user's status, we linked
        the model in the Meta Class through the model attribute, we also wrote our own __init__ method to set the availability
        field to required.
    """
    class Meta:
        model = UsersProfile
        fields = ('availability', )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['availability'].required = True


class ProfilePictureForm(forms.ModelForm):

    """
        DOCSTRING:
        This ProfilePictureForm class form is used to edit the user's profile picture, we defined it's meta class and
        set the model attribute to the UsersProfile class, we also set the fields attribute to the UsersProfile attribute
        'profile_pic',
    """

    x = forms.FloatField(widget=forms.HiddenInput())
    y = forms.FloatField(widget=forms.HiddenInput())
    width = forms.FloatField(widget=forms.HiddenInput())
    height = forms.FloatField(widget=forms.HiddenInput())

    class Meta:
        model = UsersProfile
        fields = ('profile_pic',)

    def save(self, *args, **kwargs):
        profile_picture = super().save()

        x = self.cleaned_data.get('x')
        y = self.cleaned_data.get('y')
        width = self.cleaned_data.get('width')
        height = self.cleaned_data.get('height')

        if x < 1:
            x = 1
        if y < 1:
            y = 1

        image = Image.open(profile_picture.profile_pic)
        try:
            exif = dict((ExifTags.TAGS[k], v) for k, v in image._getexif().items() if k in ExifTags.TAGS)
            if exif.get('Orientation') == 6:
                image = image.rotate(270, expand=True)
        except AttributeError:
            pass
        image = image.crop((x, y, width + x, height + y))
        image.save(profile_picture.profile_pic.path, quality=120)

        return profile_picture


class UserAccountSettingsForm(forms.ModelForm):
    """
        DOCSTRING:
        This UserAccountSettingsForm is used to edit the user's account settings, we defined the class's Meta class
        and set the model attribute aiming to the UserAccountSettings class, we excluded specific fields through the
        exclude field.
    """

    tzone = forms.ChoiceField(choices=[(x, x) for x in pytz.common_timezones])

    class Meta:
        model = UserAccountSettings
        exclude = ('user', )


class UserGeneralSettingsForm(forms.ModelForm):
    """
        DOCSTRING:
        This UserGeneralSettingsForm is used to edit the user's general settings, we defined the class's Meta class
        and set the model attribute aiming to the UserGeneralSettings class, we excluded specific fields through the
        exclude field.
    """
    class Meta:
        model = UserGeneralSettings
        exclude = ('user',)


class MailingCredentialForm(forms.ModelForm):
    """
        DOCSTRING:
        This MailingCredentialForm is used to edit the user's mailing credentials, we defined the class's Meta class
        and set the model attribute aiming to the MailingCredential class, we excluded specific fields through the
        exclude field and finally we defined our widgets in the widget field.
    """
    class Meta:
        model = MailingCredential
        exclude = ('user',)
        widgets = {
            'password': forms.PasswordInput(render_value=True),
        }


class ChatForm(forms.Form):
    """
        DOCSTRING:
        This ChatForm class form is used to display the chat, this form does not creating any instances of anything is
        used as a reference to grab the sent message from the message field. This form class inherits from the model.Form
        class.
    """
    message = forms.CharField(widget=forms.Textarea(attrs={'cols': 35, 'rows': 2, 'placeholder': 'Send Message...'}))





