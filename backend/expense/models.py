from django.db import models
from django.contrib.auth.models import User


class Expense(models.Model):
    # Fields
    create_dt = models.DateTimeField(auto_now_add=True)
    update_dt = models.DateTimeField(auto_now=True)
    description = models.CharField(max_length=200)
    is_shared = models.BooleanField(default=False)
    amount = models.DecimalField(decimal_places=2, max_digits=999999999999)

    # Related Fields
    owner = models.ForeignKey(User, related_name="expenses", on_delete=models.CASCADE)


class SharedExpense(models.Model):
    # Field Options
    STATUS_TYPES = (("UP", "Unpaid"), ("P", "Paid"))

    # Fields
    create_dt = models.DateTimeField(auto_now_add=True)
    update_dt = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=2, choices=STATUS_TYPES)
    amount = models.DecimalField(decimal_places=2, max_digits=999999999999)

    # Related Fields
    expense = models.ForeignKey(
        Expense, related_name="shared_expenses", on_delete=models.CASCADE
    )
    loaner = models.ForeignKey(
        User, related_name="shared_expenses", on_delete=models.CASCADE
    )
