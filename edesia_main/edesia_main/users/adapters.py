from typing import Any

from django.core import mail

from django.template import TemplateDoesNotExist
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.template.loader import render_to_string

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import (
    DefaultSocialAccountAdapter,
)
from django.conf import settings
from django.http import HttpRequest


class AccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request: HttpRequest):
        return getattr(
            settings, "ACCOUNT_ALLOW_REGISTRATION", True
        )

    def get_from_email(self):
        """
        This is a hook that can be overridden to programatically
        set the 'from' email address for sending emails
        """
        return settings.DEFAULT_FROM_EMAIL

    def render_mail(self, template_prefix, email, context):
        """
        Renders an e-mail to `email`. `template_prefix` identifies the
        e-mail that is to be sent, e.g. "account/email/email_confirmation"
        """
        subject = render_to_string('{0}_subject.txt'.format(template_prefix), context)
        # remove superfluous line breaks
        subject = " ".join(subject.splitlines()).strip()
        subject = self.format_email_subject(subject)

        from_email = self.get_from_email()

        bodies = {}
        for ext in ['html', 'txt']:
            try:
                template_name = '{0}_message.{1}'.format(template_prefix, ext)
                bodies[ext] = render_to_string(
                    template_name, context, self.request,
                ).strip()
            except TemplateDoesNotExist:
                if ext == 'txt' and not bodies:
                    # We need at least one body
                    raise
        if 'txt' in bodies:
            msg = EmailMultiAlternatives(subject, bodies['txt'], from_email, [email])
            if 'html' in bodies:
                msg.attach_alternative(bodies['html'], 'text/html')
        else:
            msg = EmailMessage(subject, bodies['html'], from_email, [email])
            msg.content_subtype = 'html'  # Main content is now text/html
        return msg

    def send_mail(self, template_prefix, email, context):
        try:
            mail.send_mail('hello', 'test', 'radugaf@gmail.com', ['asdsd@dfd.com'])
            msg = self.render_mail(template_prefix, email, context)
            msg.send()

            print(self)
            print(template_prefix)
            print(email)
            print(context)

            pass
        except Exception as e:
            print(e)

class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(
        self, request: HttpRequest, sociallogin: Any
    ):
        return getattr(
            settings, "ACCOUNT_ALLOW_REGISTRATION", True
        )
