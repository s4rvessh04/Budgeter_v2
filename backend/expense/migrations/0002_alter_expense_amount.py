# Generated by Django 4.1.3 on 2022-12-07 04:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("expense", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="expense",
            name="amount",
            field=models.DecimalField(decimal_places=2, max_digits=999999999999),
        ),
    ]
