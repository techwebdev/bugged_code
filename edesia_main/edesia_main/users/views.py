from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.http import HttpResponse
from django.core import mail, signing
from django.views.generic import (
    DetailView,
    RedirectView,
    UpdateView,
)

User = get_user_model()

class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    slug_field = "username"
    slug_url_kwarg = "username"

user_detail_view = UserDetailView.as_view()

class UserUpdateView(LoginRequiredMixin, UpdateView):
    fields = [
        "name",
        "bio",
    ]

    model = User

    def get_success_url(self):
        return reverse(
            "users:detail",
            kwargs={'username': self.request.user.username},
        )

    def get_object(self):
        return User.objects.get(
            username=self.request.user.username
        )


user_update_view = UserUpdateView.as_view()

class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        return reverse(
            "users:detail",
            kwargs={"username": self.request.user.username},
        )

user_redirect_view = UserRedirectView.as_view()
