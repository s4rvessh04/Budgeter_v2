# Generated by Django 4.1.3 on 2022-12-07 14:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("expense", "0005_alter_expense_shared_expense_id"),
    ]

    operations = [
        migrations.RenameField(
            model_name="expense",
            old_name="shared_expense_id",
            new_name="shared_expense",
        ),
    ]
