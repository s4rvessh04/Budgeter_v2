from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Expense, SharedExpense
from user.serializers import UserSerializer


class SharedExpenseBaseSerializer(serializers.ModelSerializer):
    loaner = serializers.SerializerMethodField()

    class Meta:
        model = SharedExpense
        fields = "__all__"

    def get_loaner(self, obj):
        return UserSerializer(obj.loaner).data


class SharedExpenseCreateSerializer(serializers.ModelSerializer):
    loaner_id = serializers.IntegerField()

    class Meta:
        model = SharedExpense
        fields = ["amount", "status", "loaner_id"]


class SharedExpenseUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    loaner_id = serializers.IntegerField()

    class Meta:
        model = SharedExpense
        fields = ["id", "amount", "status", "loaner_id"]

    # def update(self, instance, validated_data):
    #     loaner_id = validated_data.pop("loaner_id")
    #     loaner = User.objects.get(id=loaner_id)
    #     instance.loaner = loaner
    #     instance.amount = validated_data.get("amount")
    #     instance.status = validated_data.get("status")
    #     instance.save()
    #     return instance


class ExpenseListSerializer(serializers.ModelSerializer):
    shared_expenses = SharedExpenseBaseSerializer(many=True, read_only=True)
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = "__all__"

    def get_owner(self, obj):
        return UserSerializer(obj.owner).data


class ExpenseCreateSerializer(serializers.ModelSerializer):
    shared_expenses = SharedExpenseCreateSerializer(many=True, required=False)

    class Meta:
        model = Expense
        exclude = ("owner",)

    def create(self, validated_data):
        shared_expenses = validated_data.pop("shared_expenses", [])
        expense = Expense.objects.create(**validated_data)

        for shared_expense in shared_expenses:
            try:
                loaner = User.objects.get(id=shared_expense.get("loaner_id"))
                SharedExpense.objects.create(
                    loaner=loaner, expense=expense, **shared_expense
                )
            except User.DoesNotExist:
                raise ValidationError(detail="User does not exist!", code=404)

        validated_data.update({"shared_expenses": shared_expenses})
        return validated_data


class ExpenseUpdateSerializer(serializers.ModelSerializer):
    shared_expenses = SharedExpenseUpdateSerializer(many=True, required=False)

    class Meta:
        model = Expense
        exclude = ["owner"]

    def update(self, instance, validated_data):
        shared_expenses_data = validated_data.pop("shared_expenses", [])

        instance.description = validated_data.get("description", instance.description)
        instance.amount = validated_data.get("amount", instance.amount)
        instance.save()

        if shared_expenses_data != []:
            for shared_expense_data in shared_expenses_data:
                shared_expense, created = SharedExpense.objects.update_or_create(
                    id=shared_expense_data.get("id"),
                    expense=instance,
                    defaults={
                        "loaner_id": shared_expense_data.get("loaner_id"),
                        "amount": shared_expense_data.get("amount"),
                        "status": shared_expense_data.get("status"),
                    },
                )

        return instance
