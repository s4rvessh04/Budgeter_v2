from django.db import models


class Expense(models.Model):
    date_time = models.DateTimeField()
    description = models.CharField(max_length=200)
    amount = models.DecimalField(decimal_places=2, max_digits=999999999999)
    is_shared = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)
    # user_id = models.ForeignKey()


class SharedExpense(models.Model):
    STATUS_TYPES = (("UP", "Unpaid"), ("P", "Paid"))
    # main_user_id = models.ForeignKey()
    # shared_user_id = models.ForeignKey()
    amount = models.DecimalField(decimal_places=2, max_digits=999999999999)
    status = models.CharField(max_length=2, choices=STATUS_TYPES)
    expense = models.ForeignKey(
        Expense, related_name="shared_expenses", on_delete=models.CASCADE
    )
