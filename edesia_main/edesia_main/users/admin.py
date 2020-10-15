from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from edesia_main.users.forms import (
    UserChangeForm,
    UserCreationForm,
)

User = get_user_model()

@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (
        ("User", {"fields": ("name", 'restaurant_staff')}),
    )
    list_display = ["username", "name", "is_superuser", 'is_staff', 'restaurant_staff', 'is_active']
    search_fields = ["name", 'email']
