# Generated by Django 4.1.3 on 2023-01-27 11:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("expense", "0010_sharedexpense_shared_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="expense",
            name="user_id",
            field=models.ForeignKey(
                default="",
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
    ]
