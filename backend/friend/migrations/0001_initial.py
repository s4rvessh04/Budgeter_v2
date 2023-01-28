# Generated by Django 4.1.3 on 2022-12-06 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Friend",
            fields=[
                ("id", models.IntegerField(primary_key=True, serialize=False)),
                ("last_updated", models.DateTimeField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("A", "Accepted"),
                            ("R", "Rejected"),
                            ("P", "Pending"),
                        ],
                        max_length=1,
                    ),
                ),
            ],
        ),
    ]
