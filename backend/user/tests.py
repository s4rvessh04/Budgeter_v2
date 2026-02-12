from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient


class UserTestCase(TestCase):
    """Tests for user retrieval and update."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            "testuser",
            "test@example.com",
            "pass123",
            first_name="Test",
            last_name="User",
        )
        self.client.force_login(self.user)
        self.base_url = "/api/users/"

    def test_whoami(self):
        response = self.client.get(f"{self.base_url}whoami/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["email"], "test@example.com")

    def test_list_users_excludes_self(self):
        User.objects.create_user("other", "other@example.com", "pass")
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 200)
        results = response.data.get("results", response.data)
        usernames = [u["username"] for u in results]
        self.assertIn("other", usernames)
        self.assertNotIn("testuser", usernames)

    def test_update_user(self):
        response = self.client.patch(
            f"{self.base_url}{self.user.username}/update/",
            {"first_name": "Updated"},
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Updated")

    def test_update_other_user_forbidden(self):
        other = User.objects.create_user("other", "other@example.com", "pass")
        response = self.client.patch(
            f"{self.base_url}{other.username}/update/",
            {"first_name": "Hacked"},
        )
        self.assertEqual(response.status_code, 403)

    def test_check_password_correct(self):
        response = self.client.post(
            f"{self.base_url}{self.user.username}/check-password/",
            {"password": "pass123"},
        )
        self.assertEqual(response.status_code, 200)

    def test_check_password_incorrect(self):
        response = self.client.post(
            f"{self.base_url}{self.user.username}/check-password/",
            {"password": "wrongpassword"},
        )
        self.assertEqual(response.status_code, 400)

    def test_unauthenticated_access(self):
        self.client.logout()
        response = self.client.get(f"{self.base_url}whoami/")
        self.assertEqual(response.status_code, 403)
