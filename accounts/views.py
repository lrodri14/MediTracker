"""
    This views.py file contains all the views used for the accounts app to work properly, most of the views are generic
    views, it also contains function based views for more specific processes. It is composed of 21 views as whole.
"""

from django.db.models import Q
from django.shortcuts import render
from django.urls import reverse_lazy
from django.db import IntegrityError
from django.http import JsonResponse
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from twilio.jwt.access_token import AccessToken
from django.template.loader import render_to_string
from twilio.jwt.access_token.grants import ChatGrant
from .models import UsersProfile, ContactRequest, Chat
from utilities.accounts_utilities import check_requests
from meditracker.settings import TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET_KEY, TWILIO_CHAT_SERVICE_SID
from .forms import DoctorSignUpForm, AssistantSignUpForm, ProfileForm, ProfilePictureForm, ChatForm
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView, PasswordChangeDoneView, \
    PasswordResetView, PasswordResetDoneView, PasswordResetCompleteView, PasswordResetConfirmView
User = get_user_model()

# Create your views here.


class Login(LoginView):

    """
        DOCSTRING:
        This Login class view, is used to display the login and form and to login the user once the user inserts the
        right credentials, this class overwrites the get, form_valid and form_invalid methods. The form will now be
        displayed asynchronously so the get method will return the form as a JSON Response to the front end, the form-
        _valid method will return a success key to indicate that the user entered the right credentials, and the form-
        _invalid method will return the cleaned form with the proper errors.
    """

    template_name = 'accounts/login.html'

    def get(self, request, *args, **kwargs):
        context = super().get_context_data()
        data = {'html': render_to_string(self.template_name, context=context, request=self.request)}
        return JsonResponse(data)

    def form_valid(self, form):
        super().form_valid(form)
        # self.request.session.set_expiry(self.request.user.account_settings.session_expire_time)
        data = {'success': 'Login Successful'}
        return JsonResponse(data)

    def form_invalid(self, form):
        context = super().get_context_data()
        data = {'html': render_to_string(self.template_name, context, request=self.request)}
        return JsonResponse(data)


class Logout(LogoutView):
    """
        DOCSTRING:
        The Logout class view is used to logout the user from it's session.
    """
    pass


class ChangePassword(PasswordChangeView):
    """
        DOCSTRING:
        This ChangePassword class view is used to change the user's password, this function overwrites the get, form_va-
        lid and form_invalid methods The form will now be displayed asynchronously so the get method will return the
        form as a JSON Response to the front end, the form_valid method will return a success key to indicate that the
        user's inputs are correct, and the form_invalid method will return the cleaned form with the proper errors.
    """
    template_name = 'accounts/change_password.html'
    success_url = reverse_lazy('accounts:change_password_done')

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        data = {'html': render_to_string(self.template_name, context=context, request=self.request)}
        return JsonResponse(data)

    def form_valid(self, form):
        super().form_valid(form)
        data = {'success': True}
        return JsonResponse(data)

    def form_invalid(self, form):
        super().form_invalid(form)
        context = super().get_context_data()
        data = {'html': render_to_string(self.template_name, context, self.request)}
        return JsonResponse(data)


class ChangePasswordDone(PasswordChangeDoneView):
    """
        DOCSTRING:
        This ChangePasswordDone class view is used to display a message to the user once the password has been changed
        successfully.
    """
    template_name = 'accounts/change_password_done.html'


class PasswordReset(PasswordResetView):
    """
        DOCSTRING:
        This PasswordReset class view is used to reset the password in case the user forgets his or her password. This
        class displays the form in JSON Format, we overwrote the get method for this task.
    """
    template_name = 'accounts/password_reset.html'
    email_template_name = 'accounts/password_reset_email.html'
    subject_template_name = 'accounts/password_reset.txt'
    success_url = reverse_lazy('accounts:password_reset_done')

    def get(self, request, *args, **kwargs):
        context = super().get_context_data()
        data = {'html': render_to_string(self.template_name, context, self.request)}
        return JsonResponse(data)


class PasswordResetDone(PasswordResetDoneView):
    """
        DOCSTRING:
        This PasswordResetDone class view is used to display to the user that an email has been sent to his email with
        instructions he must follow to reset his password.
    """
    template_name = 'accounts/password_reset_done.html'

    def get(self, request, *args, **kwargs):
        context = super().get_context_data()
        data = {'html': render_to_string(self.template_name, context, self.request)}
        return JsonResponse(data)


class PasswordResetConfirm(PasswordResetConfirmView):
    """
        DOCSTRING:
        This PasswordResetConfirm class view is used to display to the user a form for the password reset.
    """
    template_name = 'accounts/password_reset_confirm.html'
    success_url = reverse_lazy('accounts:password_reset_complete')


class PasswordResetComplete(PasswordResetCompleteView):
    """
        DOCSTRING:
        This PasswordResetComplete class view is used to display to the password reset is succesful and has been completed.
    """
    template_name = 'accounts/password_reset_complete.html'


def signup(request):
    """
        DOCSTRING:
        This signup function is used to create a user model instance, this way users will be able to access the app,
        this function receives one obligatory parameter: request, which expects a request object, if the request.method
        attribute is 'GET' then the form will be returned in JSON Format an displayed in the front-end asynchronously,
        if the request.method attribute is a "POST", then the view will check if the form data is valid, if the condi-
        tion is fulfilled, then the user will be saved but not committed, depending if the speciality field was filled,
        the roll will be set to DOCTOR or to ASSISTANT and will be added to the corresponding group, fianlly it's
        mailing credentials will be created, if the form is not valid, the proper errors will be returned along with
        the form.
    """
    data = {}
    account_type = request.GET.get('account_type')

    if account_type == 'doctor':
        user_creation_form = DoctorSignUpForm
        profile_creation_form = ProfileForm
    else:
        user_creation_form = AssistantSignUpForm
        profile_creation_form = None

    if request.method == 'POST':
        doctor = Group.objects.get(name='Doctor')
        assistant = Group.objects.get(name='Assistant')

        if 'speciality' in request.POST:
            user_creation_form = DoctorSignUpForm(request.POST)
            profile_creation_form = ProfileForm(request.POST)
        else:
            user_creation_form = AssistantSignUpForm(request.POST)

        if user_creation_form.is_valid():
            user = user_creation_form.save(commit=False)
            if user_creation_form.cleaned_data.get('speciality'):
                user_profile = profile_creation_form.save(commit=False)
                user.assign_roll(speciality=True)
                user.generate_linking_id()
                user.save()
                user.groups.add(doctor)
                user_profile.user = user
                user_profile.save()
            else:
                user.assign_roll(speciality=False)
                user.save()
                user.groups.add(assistant)
        else:
            data['error'] = True

    context = {'user_creation_form': user_creation_form, 'profile_creation_form': profile_creation_form}
    data['html'] = render_to_string('accounts/signup.html', context, request)
    return JsonResponse(data)


def profile(request, pk=None):
    """
        DOCSTRING:
        This profile view is used to display the user's profile, this function takes an optional parameter,
        pk, which expects a user pk, if this parameter is set, then the user profile will be displayed as guest mode,
        in which you can only read this profile, if the pk parameter is not, the authenticated user is requesting his
        profile, then the user's profile will be displayed with the possibility to make changes.
    """
    user_profile = UsersProfile.objects.get(user__pk=pk) if pk else request.user.profile
    pending_request = check_requests(user_profile.user)
    profile_edit_form = ProfileForm(instance=request.user.profile)
    context = {'profile': user_profile, 'pending_request': pending_request, 'form': profile_edit_form}
    return render(request, 'accounts/profile.html', context)


def profile_picture_change(request):
    """
        DOCSTRING:
        This profile_picture_change view is used to change the user's profile picture, this form will be displayed in the
        front-end asynchronously, so the view will return this content in a JSON Format if the request.method attribute
        is 'GET'. If the request.method attribute is 'POST' then the view will check if the form's data is valid and the
        picture will be changed successfully.
    """
    form = ProfilePictureForm(instance=request.user.profile)
    template = 'accounts/profile_picture_change.html'
    if request.method == 'POST':
        form = ProfilePictureForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            profile_edit_form = ProfileForm(instance=request.user.profile)
            context = {'profile': request.user.profile, 'form': profile_edit_form}
            data = {'success': render_to_string('accounts/partial_profile.html', context=context, request=request)}
            return JsonResponse(data)
    context = {'form': form}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def profile_change(request):
    """
        DOCSTRING:
        This profile_change view is used to change the user's profile , this form will be displayed in the
        front-end asynchronously, so the view will return this content in a JSON Format if the request.method attribute
        is 'GET'. If the request.method attribute is 'POST' then the view will check if the form's data is valid and the
        profile will be changed successfully.
    """
    form = ProfileForm(instance=request.user.profile)
    template = 'accounts/profile_change.html'
    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            context = {'profile': request.user.profile, 'form': ProfileForm(instance=request.user.profile)}
            data = {'success': render_to_string('accounts/partial_profile.html', context=context, request=request)}
            return JsonResponse(data)
    context = {'form': form, 'profile': request.user.profile}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def user_lookup(request):
    """
        DOCSTRING:
        This user_lookup view is used to look a user up in the database, this view takes one single parameter: request,
        which expects a request object, this request object contains a 'query' key we must extract to proceed with the
        filtering, independently if the searching was successful or not, the response will be returned in JSON Format.
    """
    query = request.GET.get('query')
    users = User.objects.filter(Q(username__startswith=query) | Q(first_name__startswith=query) | Q(last_name__startswith=query), roll='DOCTOR').exclude(username=request.user).order_by('first_name')
    template = 'accounts/users_lookup_results.html'
    context = {'users': users}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def contacts(request):
    """
        DOCSTRING:
        This contacts view is used to display contacts related to the user, this view takes one single parameter: request,
        which expects a request object, this request object contains a 'query' key we must extract to proceed with the
        filtering, independently if the searching was successful or not, the response will be returned in JSON Format.
    """
    contacts_list = UsersProfile.objects.filter(contacts__in=[request.user]).order_by('user__first_name')
    template = 'accounts/contacts.html'
    context = {'contacts': contacts_list}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def remove_contact(request, pk):
    """
        DOCSTRING:
        This remove_contact view will remove a specific contact link between the user that made the request and user asked
        to be removed, this function will also delete the chat instance in which both the user requesting this petition and
        the user asked to be removed take part of.
    """
    contact = User.objects.get(pk=pk)
    chat = Chat.objects.filter(participants__in=[request.user, contact])
    request.user.profile.contacts.remove(contact)
    contact.profile.contacts.remove(request.user)
    chat.delete()
    data = {'success': 'Contact removed successfully'}
    return JsonResponse(data)


def chats(request):
    """
        DOCSTRING:
        This chats view is used to display chats from which the user takes part, the response will be returned in JSON
        Format.
    """
    chats_list = Chat.objects.filter(participants__in=[request.user])
    template = 'accounts/chats.html'
    context = {'chats': chats_list}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def display_chat(request, pk):
    """
        DOCSTRING:
        The display_chat view is used to display a specific chat in which the current user is part of the chat partici-
        pants, to display the chat there is some data we need to collect and send to the front-end first.
        1. Create an identity: The identity we will use in our chat is the user's username
        2. Device id: We return the device ID we collect from the 'device' key in our GET dictionary.
        3. TOKEN: To create a Twilio Chat Client instance in the front-end we need to generate a unique token using our
                  Twilio credentials. We make use of the AccessToken class to create this instance.
        4. endpoint: Our chat will contain an endpoint we generate using the identity value and the device id.
        5. We need to add an access grant to the token using the add_grant() method inside the instance, we add this
           grant by passing the endpoint_id and the service string identifier.
        6. Our chat will contain a unique channel_name we generate from the __str__ value of the Chat object instance
    """
    identity = request.user.username
    device_id = request.GET.get('device')
    account_sid = TWILIO_ACCOUNT_SID
    api_key = TWILIO_API_KEY
    secret_key = TWILIO_API_SECRET_KEY
    chat_service_sid = TWILIO_CHAT_SERVICE_SID
    token = AccessToken(account_sid, api_key, secret_key, identity=identity)
    endpoint = "PrivateChat:{}:{}".format(identity, device_id)
    if chat_service_sid:
        chat_grant = ChatGrant(endpoint_id=endpoint, service_sid=chat_service_sid)
        token.add_grant(chat_grant)
    template = 'accounts/chat.html'
    form = ChatForm
    destination = User.objects.get(pk=pk)
    channel_name = str(Chat.objects.filter(participants__in=[request.user, destination])[0])
    context = {'chat_form': form, 'destination': destination}
    data = {'html': render_to_string(template, context, request), 'identity': identity, 'channel_name': channel_name,
            'token': token.to_jwt().decode('utf-8')}
    return JsonResponse(data)


def contact_requests(request):
    """
        DOCSTRING:
        This contact_requests view is used to display the requests that have been sent to the user, the response will
        be returned in JSON Format.
    """
    contact_requests_list = ContactRequest.objects.filter(to_user=request.user)
    template = 'accounts/requests.html'
    context = {'contact_requests': contact_requests_list}
    data = {'html': render_to_string(template, context, request)}
    return JsonResponse(data)


def send_cancel_contact_request(request, pk):
    """
        DOCSTRING:
        The send_cancel_contact_request view is used to send or cancel contact linking request, this view only takes an
        obligatory paramater: pk, the pk of the user to whom the user is sending the request, from the request.GET dict
        we are going to extract a key, the 'procedure' key, of the key contains the 'send' string, a ContactRequest in-
        stance will be created, if the string contains 'cancel' then the ContactRequest instance will be deleted.
    """
    procedure = request.GET.get('procedure')
    sender = request.user
    receiver = User.objects.get(pk=pk)
    try:
        if procedure == 'send':
            contact_request = ContactRequest(to_user=receiver, from_user=sender)
            contact_request.save()
            data = {'success': 'Request sent successfully', 'created_by': request.user.username, 'to': receiver.username}
        else:
            contact_request = ContactRequest.objects.get(to_user=receiver, from_user=sender)
            contact_request.delete()
            data = {'success': 'Request cancelled successfully'}
        return JsonResponse(data)
    except IntegrityError:
        data = {'unsuccessfulSending': 'Unsuccessful request sending'}
    except ContactRequest.DoesNotExist:
        data = {'unsuccessfulCancellation': 'Request has already been accepted'}
    return JsonResponse(data)


def contact_request_response(request, pk):
    """
        DOCSTRING:
        The contact_request_response view is used to reply contact linking request, this view only takes an obligatory
        parameter, the pk of the ContactRequest, we are going to extract the 'response' key, if the string inside the
        response is key is accepeted, then the linking will be set, if the condition is not fulfilled, no linking will
        be set, finally the ContactRequest instance will be deleted.
    """
    try:
        response = request.GET.get('response')
        contact_request = ContactRequest.objects.get(pk=pk)
        sender = contact_request.from_user
        receiver = request.user
        data = {}
        if response == 'accepted':
            receiver.profile.contacts.add(contact_request.from_user)
            sender.profile.contacts.add(request.user)
            private_chat = Chat.objects.create()
            private_chat.participants.add(receiver)
            private_chat.participants.add(sender)
            data['accepted'] = 'Request Accepted'
            data['to'] = sender.username
            data['created_by'] = request.user.username
        contact_request.delete()
        contact_requests_list = ContactRequest.objects.filter(to_user=request.user)
        template = 'accounts/requests.html'
        context = {'contact_requests': contact_requests_list}
        data['html'] = render_to_string(template, context, request)
        return JsonResponse(data)
    except ContactRequest.DoesNotExist:
        data = {'contact_request_unexistent': 'Contact request was no longer available'}
        return JsonResponse(data)


