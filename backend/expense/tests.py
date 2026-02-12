from decimal import Decimal

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Expense, SharedExpense


class ExpenseCRUDTestCase(TestCase):
    """Tests for expense CRUD operations."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user("testuser", "test@example.com", "pass123")
        self.other_user = User.objects.create_user("other", "other@example.com", "pass")
        self.client.force_login(self.user)
        self.base_url = "/api/expenses/"

    def test_create_expense(self):
        response = self.client.post(
            self.base_url,
            {"description": "Groceries", "amount": "50.00"},
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Expense.objects.count(), 1)
        expense = Expense.objects.first()
        self.assertEqual(expense.owner, self.user)
        self.assertEqual(expense.amount, Decimal("50.00"))

    def test_list_expenses_only_own(self):
        Expense.objects.create(description="Mine", amount="10.00", owner=self.user)
        Expense.objects.create(description="Theirs", amount="20.00", owner=self.other_user)
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 200)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["description"], "Mine")

    def test_retrieve_expense(self):
        expense = Expense.objects.create(
            description="Coffee", amount="5.00", owner=self.user
        )
        response = self.client.get(f"{self.base_url}{expense.pk}/")
        self.assertEqual(response.status_code, 200)

    def test_retrieve_other_users_expense_forbidden(self):
        expense = Expense.objects.create(
            description="Secret", amount="100.00", owner=self.other_user
        )
        response = self.client.get(f"{self.base_url}{expense.pk}/")
        self.assertEqual(response.status_code, 404)

    def test_update_expense(self):
        expense = Expense.objects.create(
            description="Old", amount="10.00", owner=self.user
        )
        response = self.client.put(
            f"{self.base_url}{expense.pk}/update",
            {"description": "Updated", "amount": "20.00"},
        )
        self.assertEqual(response.status_code, 200)
        expense.refresh_from_db()
        self.assertEqual(expense.description, "Updated")

    def test_delete_expense(self):
        expense = Expense.objects.create(
            description="Delete me", amount="10.00", owner=self.user
        )
        response = self.client.delete(f"{self.base_url}{expense.pk}/delete")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Expense.objects.count(), 0)

    def test_unauthenticated_access(self):
        self.client.logout()
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 403)


class SharedExpenseTestCase(TestCase):
    """Tests for shared expense listing."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user("testuser", "test@example.com", "pass123")
        self.friend = User.objects.create_user("friend", "friend@example.com", "pass")
        self.client.force_login(self.user)

    def test_create_expense_with_shared(self):
        response = self.client.post(
            "/api/expenses/",
            {
                "description": "Dinner",
                "amount": "100.00",
                "shared_expenses": [
                    {"amount": "50.00", "status": "UP", "loaner_id": self.friend.id}
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SharedExpense.objects.count(), 1)

    def test_shared_expense_list(self):
        expense = Expense.objects.create(
            description="Lunch", amount="60.00", owner=self.user
        )
        SharedExpense.objects.create(
            expense=expense, loaner=self.friend, amount="30.00", status="UP"
        )
        response = self.client.get("/api/expenses/shared/")
        self.assertEqual(response.status_code, 200)
