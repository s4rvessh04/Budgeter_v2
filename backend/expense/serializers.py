from rest_framework import serializers

from .models import Expense, SharedExpense


class SharedExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedExpense
        fields = ["id", "amount", "status"]


class ExpenseSerializer(serializers.ModelSerializer):
    shared_expenses = SharedExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Expense
        fields = [
            "id",
            "date_time",
            "description",
            "amount",
            "is_shared",
            "last_updated",
            "shared_expenses",
        ]


class SharedExpenseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedExpense
        fields = ["amount", "status"]


class ExpenseCreateSerializer(serializers.ModelSerializer):
    shared_expenses = SharedExpenseCreateSerializer(many=True, required=False)

    class Meta:
        model = Expense
        fields = ["date_time", "description", "amount", "is_shared", "shared_expenses"]

    def create(self, validated_data):
        is_shared = validated_data.get("is_shared", False)
        shared_expenses_data = validated_data.pop("shared_expenses", [])
        expense = Expense.objects.create(**validated_data)

        if is_shared:
            for shared_expense in shared_expenses_data:
                SharedExpense.objects.create(expense=expense, **shared_expense)
        return expense
