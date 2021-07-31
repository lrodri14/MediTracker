"""
    In this middleware.py file remains the middleware functionality proper to the account app. It is composed of two
    middleware classes.
"""

from django.conf import settings
from django.shortcuts import redirect
from django.utils import timezone
import pytz


class LoginRequiredMiddleware:

    """
        This LoginRequiredMiddleware is used to make sure that to access any of the application views that are not
        defined inside our view_names list, the user must be authenticated.
        We defined our initialization method __init__ which accepts a get_response callable.
        We defined our dunder __call__ method to make sure the class instance can be called as a function.
        Finally we wrote our process_view Django middleware hook.
        This hook will check if the the condition is fulfilled or not, if the condition is fulfilled then we will be
        redirected to our homepage, otherwise we will be redirected to the login page.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        view_names = ['Login', 'signup', 'main', 'PasswordReset',
                      'PasswordResetDone', 'PasswordResetConfirm',
                      'PasswordResetComplete', 'confirm_identity']

        if view_func.__name__ not in view_names and not request.user.is_authenticated:
            return redirect(settings.LOGIN_URL)


class TimezoneMiddleware:

    """
        DOCSTRING:
        This TimezoneMiddleware is used to activate the timezone for the authenticated user, the timezone to activate
        will be collected from the user's profile timezone attribute.
        First we define our initialization method __init__ which accepts a single argument 'get_response' and expects
        a get_response callable.
        Finally we define our __call__ dunder method, this way any TimezoneMiddleware instances can be called as funcs,
        just before we call our view we will collect the data needed from the user's profile. If the timezone was
        collected we will activate it using the timezone.activate() method. If there is no timezone, then the timezone
        will be deactivated using the timezone.deactivate() method. Finally our response will be returned calling the
        get_response callable and passing the request object as it's parameters.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and request.user.username != 'admin':
            tzname = request.user.account_settings.tzone
            if tzname:
                timezone.activate(pytz.timezone(tzname))
            else:
                timezone.deactivate()
        else:
            pass
        return self.get_response(request)





