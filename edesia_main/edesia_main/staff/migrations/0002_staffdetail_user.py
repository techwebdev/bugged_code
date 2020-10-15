# Generated by Django 3.1.2 on 2020-10-15 15:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('staff', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='staffdetail',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='restaurant', to=settings.AUTH_USER_MODEL),
        ),
    ]
