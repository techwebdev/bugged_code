from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    name = "edesia_main.users"
    verbose_name = _("Users")

    def ready(self):
        try:
            import edesia_main.users.signals  # noqa F401
        except ImportError:
            pass
