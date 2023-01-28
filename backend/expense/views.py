from rest_framework import generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    ExpenseListSerializer,
    SharedExpenseSerializer,
    ExpenseCreateSerializer,
)
from .models import Expense, SharedExpense


class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.order_by("-date_time").all()

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        self.serializer_class = ExpenseCreateSerializer
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseRetrieveAPIView(generics.RetrieveAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(user=self.request.user)


class ExpenseUpdateAPIView(generics.UpdateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseCreateSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(user=self.request.user)


class ExpenseDestroyAPIView(generics.DestroyAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(user=self.request.user)


class SharedExpenseListAPIView(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseSerializer
    queryset = SharedExpense.objects.order_by("-expense__date_time").all()

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(shared_user=self.request.user)


class SharedExpenseRetrieveAPIView(generics.RetrieveAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(shared_user=self.request.user)


class SharedExpenseUpdateAPIView(generics.UpdateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(expense__user=self.request.user)


class SharedExpenseDestroyAPIView(generics.DestroyAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(expense__user=self.request.user)
