from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Expense, SharedExpense


class SharedExpenseSerializer(serializers.ModelSerializer):
    expense_id = serializers.PrimaryKeyRelatedField(read_only=True, many=False)
    main_user = serializers.CharField(source="expense.user.username", read_only=True)

    class Meta:
        model = SharedExpense
        fields = ("id", "amount", "status", "shared_user", "expense_id", "main_user")


class SharedExpenseCreateSerializer(serializers.ModelSerializer):
    shared_user_id = serializers.IntegerField()

    class Meta:
        model = SharedExpense
        fields = (
            "amount",
            "status",
            "shared_user_id",
        )


class ExpenseListSerializer(serializers.ModelSerializer):
    shared_expenses = SharedExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Expense
        fields = "__all__"


class ExpenseCreateSerializer(serializers.ModelSerializer):
    shared_expenses = SharedExpenseCreateSerializer(many=True, required=False)

    class Meta:
        model = Expense
        exclude = ("user",)

    def create(self, validated_data):
        is_shared = validated_data.get("is_shared", False)
        shared_expenses = validated_data.pop("shared_expenses", [])
        expense = Expense.objects.create(**validated_data)

        if is_shared:
            for shared_expense in shared_expenses:
                try:
                    shared_user = User.objects.get(
                        id=shared_expense.get("shared_user_id")
                    )
                    SharedExpense.objects.create(
                        shared_user=shared_user, expense=expense, **shared_expense
                    )
                except User.DoesNotExist:
                    raise ValidationError(
                        detail="Shared user does not exist!", code=404
                    )

        validated_data.update({"shared_expenses": shared_expenses})
        return validated_data
