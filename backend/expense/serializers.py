from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Expense, SharedExpense
from user.serializers import UserSerializer


class SharedExpenseSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    loaner = serializers.SerializerMethodField()

    class Meta:
        model = SharedExpense
        fields = "__all__"

    def get_owner(self, obj):
        return UserSerializer(obj.expense.owner).data

    def get_loaner(self, obj):
        return UserSerializer(obj.loaner).data


class SharedExpenseCreateSerializer(serializers.ModelSerializer):
    loaner_id = serializers.IntegerField()

    class Meta:
        model = SharedExpense
        fields = (
            "amount",
            "status",
            "loaner_id",
        )


class ExpenseListSerializer(serializers.ModelSerializer):
    shared_expenses = SharedExpenseSerializer(many=True, read_only=True)
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
        is_shared = validated_data.get("is_shared", False)
        shared_expenses = validated_data.pop("shared_expenses", [])
        expense = Expense.objects.create(**validated_data)

        if is_shared:
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

    def update(self, instance, validated_data):
        is_shared = validated_data.get("is_shared", False)

        if is_shared or validated_data.get("shared_expenses", []) != []:
            shared_expenses_data = validated_data.get("shared_expenses", None)
            for shared_expense in shared_expenses_data:
                instance.shared_expenses.update(**shared_expense)
            instance.save()

        Expense.objects.filter(id=instance.id).update(**validated_data)
        instance.refresh_from_db()
        return instance
