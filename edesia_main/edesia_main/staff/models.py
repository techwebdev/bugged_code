from django.db import models
from django_countries.fields import CountryField
from django.conf import settings

class StaffDetail(models.Model):

    nationality = CountryField(blank=True, null=True)
    phonenumber = models.CharField(blank=True, null=True, max_length=200)
    businessname = models.CharField(blank=True, null=True, max_length=255)
    taxnumber = models.CharField(blank=True, null=True, max_length=100)
    country = CountryField(blank=True, null=True)
    city = models.CharField(blank=True, null=True, max_length=50)
    zip_code = models.CharField(blank=True, null=True, max_length=100)
    street = models.CharField(blank=True, null=True, max_length=255)
    street_details = models.CharField(blank=True, null=True, max_length=500)
    business_certificate = models.FileField(blank=True, null=True)
    restaurant_contact_person = models.FileField(blank=True, null=True)
    profile_photo = models.FileField(blank=True, null=True)
    restaurant_cover_photo = models.FileField(blank=True, null=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.SET_NULL,
        related_name="restaurant"
    )

    def __str__(self):
        return '{}{}'.format(self.user.fullname(), self.businessname)
