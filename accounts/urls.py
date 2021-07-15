"""
    This urls.py file contains all the needed routes for the account app to work properly. It is composed of 21 urls.
"""

from django.urls import path
from .views import Login, Logout, ChangePassword, ChangePasswordDone, PasswordReset, PasswordResetDone, \
    PasswordResetConfirm, PasswordResetComplete, signup, manage_subscription, profile_change, profile_picture_change, \
    profile, user_lookup, manage_block_list, display_block_list, contacts, remove_contact, chats, display_chat, save_message, \
    contact_requests, send_cancel_contact_request, contact_request_response

app_name = 'accounts'
urlpatterns = [
    path('login', Login.as_view(), name='login'),
    path('logout', Logout.as_view(), name='logout'),
    path('change_password', ChangePassword.as_view(), name='change_password'),
    path('change_password_done', ChangePasswordDone.as_view(), name='change_password_done'),
    path('password_reset', PasswordReset.as_view(), name='password_reset'),
    path('password_reset_done', PasswordResetDone.as_view(), name='password_reset_done'),
    path('password_reset_confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='password_reset_confirm'),
    path('password_reset_complete', PasswordResetComplete.as_view(), name='password_reset_complete'),
    path('signup', signup, name='signup'),
    path('manage_subscription/', manage_subscription, name='manage_subscription'),
    path('manage_subscription/<slug:action>', manage_subscription, name='manage_subscription'),
    path('profile', profile, name='profile'),
    path('profile/<int:pk>', profile, name='profile'),
    path('profile_picture_change', profile_picture_change, name='profile_picture_change'),
    path('profile_change', profile_change, name='profile_change'),
    path('user_lookup', user_lookup, name='user_lookup'),
    path('display_block_list', display_block_list, name='display_block_list'),
    path('manage_block_list/<int:pk>', manage_block_list, name='manage_block_list'),
    path('contacts', contacts, name='contacts'),
    path('remove_contact/<int:pk>', remove_contact, name='remove_contact'),
    path('chats', chats, name='chats'),
    path('display_chat/<int:pk>', display_chat, name='display_chat'),
    path('save_message/<int:chat_pk>', save_message, name='save_message'),
    path('contact_requests', contact_requests, name='contact_requests'),
    path('send_cancel_contact_request/<int:pk>', send_cancel_contact_request, name='send_cancel_contact_request'),
    path('contact_request_response/<int:pk>', contact_request_response, name='contact_request_response'),
]
