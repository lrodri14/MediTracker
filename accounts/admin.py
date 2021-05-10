"""
    This admin.py file contains all our models registers.
"""

from django.contrib import admin
from .models import CustomUser, Assistant, Doctor, UsersProfile, UserAccountSettings, UserGeneralSettings, MailingCredential, ContactRequest, Chat
from .forms import UserChangeForm, UserCreationForm
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = BaseUserAdmin.fieldsets + (('Title Info', {'fields': ('roll', )}),)
    add_fieldsets = ((None, {'fields': ('username', 'password1', 'password2', 'roll'), }, ), )


admin.site.register(CustomUser, UserAdmin)
admin.site.register(Assistant)
admin.site.register(Doctor)
admin.site.register(UsersProfile)
admin.site.register(UserAccountSettings)
admin.site.register(UserGeneralSettings)
admin.site.register(MailingCredential)
admin.site.register(ContactRequest)
admin.site.register(Chat)
