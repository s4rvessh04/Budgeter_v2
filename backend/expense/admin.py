from django.contrib import admin

from .models import Expense, SharedExpense

# Register your models here.
admin.site.register(Expense)
admin.site.register(SharedExpense)