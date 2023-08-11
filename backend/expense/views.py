from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import *
from .models import Expense, SharedExpense


class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.order_by("-create_dt").all()

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        self.serializer_class = ExpenseCreateSerializer
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ExpenseRetrieveAPIView(generics.RetrieveAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(owner=self.request.user)


class ExpenseUpdateAPIView(generics.UpdateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseUpdateSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(owner=self.request.user)


class ExpenseDestroyAPIView(generics.DestroyAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(owner=self.request.user)


class SharedExpenseListAPIView(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseBaseSerializer
    queryset = SharedExpense.objects.order_by("-expense__create_dt").all()

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(expense__owner=self.request.user)

    def get(self, request, *args, **kwargs):
        from itertools import groupby

        qs = self.get_queryset()
        serializer_data = self.get_serializer(qs, many=True).data

        rows = groupby(serializer_data, lambda x: x["loaner"])
        grouped_data = []

        for owner, rows in rows:
            grouped_data.append({"loaner": owner, "expenses": list(rows)})
        return Response(grouped_data)


class SharedExpenseRetrieveAPIView(generics.RetrieveAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseBaseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(expense__owner=self.request.user)


class SharedExpenseUpdateAPIView(generics.UpdateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseBaseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(expense__owner=self.request.user)


class SharedExpenseDestroyAPIView(generics.DestroyAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseBaseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(expense__owner=self.request.user)


class SharedExpenseOweListAPIView(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SharedExpenseOweSerializer
    queryset = SharedExpense.objects.order_by("-expense__create_dt").all()

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(loaner=self.request.user)

    def get(self, request, *args, **kwargs):
        from itertools import groupby

        qs = self.get_queryset()
        serializer_data = self.get_serializer(qs, many=True).data

        rows = groupby(serializer_data, lambda x: x["owner"])

        grouped_data = []

        for owner, rows in rows:
            grouped_data.append({"owner": owner, "expenses": list(rows)})
        return Response(grouped_data)
