from rest_framework import generics
from rest_framework.response import Response

from service.mixins import OwnerFilterMixin

from .serializers import (
    ExpenseListSerializer,
    ExpenseCreateSerializer,
    ExpenseUpdateSerializer,
    SharedExpenseBaseSerializer,
    SharedExpenseOweSerializer,
)
from .models import Expense, SharedExpense


class ExpenseListCreateAPIView(OwnerFilterMixin, generics.ListCreateAPIView):
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.order_by("-create_dt").all()
    owner_field = "owner"

    def create(self, request, *args, **kwargs):
        self.serializer_class = ExpenseCreateSerializer
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ExpenseRetrieveAPIView(OwnerFilterMixin, generics.RetrieveAPIView):
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"
    owner_field = "owner"


class ExpenseUpdateAPIView(OwnerFilterMixin, generics.UpdateAPIView):
    serializer_class = ExpenseUpdateSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"
    owner_field = "owner"


class ExpenseDestroyAPIView(OwnerFilterMixin, generics.DestroyAPIView):
    serializer_class = ExpenseListSerializer
    queryset = Expense.objects.all()
    lookup_field = "pk"
    owner_field = "owner"


class SharedExpenseListAPIView(OwnerFilterMixin, generics.ListAPIView):
    serializer_class = SharedExpenseBaseSerializer
    queryset = SharedExpense.objects.order_by("-expense__create_dt").all()
    owner_field = "expense__owner"

    def get(self, request, *args, **kwargs):
        from itertools import groupby

        qs = self.get_queryset()
        serializer_data = self.get_serializer(qs, many=True).data

        rows = groupby(serializer_data, lambda x: x["loaner"])
        grouped_data = []

        for owner, rows in rows:
            grouped_data.append({"loaner": owner, "expenses": list(rows)})
        return Response(grouped_data)


class SharedExpenseRetrieveAPIView(OwnerFilterMixin, generics.RetrieveAPIView):
    serializer_class = SharedExpenseBaseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"
    owner_field = "expense__owner"


class SharedExpenseUpdateAPIView(OwnerFilterMixin, generics.UpdateAPIView):
    serializer_class = SharedExpenseBaseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"
    owner_field = "expense__owner"


class SharedExpenseDestroyAPIView(OwnerFilterMixin, generics.DestroyAPIView):
    serializer_class = SharedExpenseBaseSerializer
    queryset = SharedExpense.objects.all()
    lookup_field = "pk"
    owner_field = "expense__owner"


class SharedExpenseOweListAPIView(OwnerFilterMixin, generics.ListAPIView):
    serializer_class = SharedExpenseOweSerializer
    queryset = SharedExpense.objects.order_by("-expense__create_dt").all()
    owner_field = "loaner"

    def get(self, request, *args, **kwargs):
        from itertools import groupby

        qs = self.get_queryset()
        serializer_data = self.get_serializer(qs, many=True).data

        rows = groupby(serializer_data, lambda x: x["owner"])

        grouped_data = []

        for owner, rows in rows:
            grouped_data.append({"owner": owner, "expenses": list(rows)})
        return Response(grouped_data)
