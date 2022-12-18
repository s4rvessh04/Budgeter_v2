from rest_framework import generics
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from knox.auth import TokenAuthentication

from .serializers import (
    ExpenseSerializer,
    SharedExpenseSerializer,
    ExpenseCreateSerializer,
    SharedExpenseCreateSerializer,
)
from .models import Expense, SharedExpense


class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [
        TokenAuthentication,
        SessionAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    queryset = Expense.objects.all()
    serializer_class = ExpenseCreateSerializer

    def get_serializer_class(self):
        print(self.request.user)
        if self.request.method == "GET":
            return ExpenseSerializer
        return super().get_serializer_class()


class ExpenseRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    lookup_field = "pk"


class ExpenseUpdateAPIView(generics.UpdateAPIView):
    """
    Updates a single model instance
    """

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    lookup_field = "pk"

    def perform_update(self, serializer):
        return super().perform_update(serializer)


class ExpenseDestroyAPIView(generics.DestroyAPIView):
    """
    Deletes a single model instance
    """

    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    lookup_field = "pk"

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


class SharedExpenseListCreateAPIView(generics.ListCreateAPIView):
    """
    Get the collection of shared_expense models
    """

    queryset = SharedExpense.objects.all()
    serializer_class = SharedExpenseSerializer

    def perform_create(self, serializer):
        return super().perform_create(serializer)


class SharedExpenseRetrieveAPIView(generics.RetrieveAPIView):
    """
    Get a single expense model
    """

    queryset = SharedExpense.objects.all()
    serializer_class = SharedExpenseSerializer
    lookup_field = "pk"


class SharedExpenseUpdateAPIView(generics.UpdateAPIView):
    """
    Updates a single model instance
    """

    queryset = SharedExpense.objects.all()
    serializer_class = SharedExpenseSerializer
    lookup_field = "pk"

    def perform_update(self, serializer):
        return super().perform_update(serializer)


class SharedExpenseDestroyAPIView(generics.DestroyAPIView):
    """
    Deletes a single model instance
    """

    queryset = SharedExpense.objects.all()
    serializer_class = SharedExpenseSerializer
    lookup_field = "pk"

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)
