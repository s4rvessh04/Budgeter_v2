from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient


class AuthTestCase(TestCase):
    """Tests for signup, login, and logout flows."""

    def setUp(self):
        self.client = APIClient()
        self.signup_url = "/api/auth/signup/"
        self.login_url = "/api/auth/login/"
        self.logout_url = "/api/auth/logout/"

    def test_signup_success(self):
        response = self.client.post(
            self.signup_url,
            {
                "username": "testuser",
                "password": "testpass123",
                "email": "test@example.com",
                "first_name": "Test",
                "last_name": "User",
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_signup_duplicate_user(self):
        User.objects.create_user("testuser", "test@example.com", "testpass123")
        response = self.client.post(
            self.signup_url,
            {
                "username": "testuser",
                "password": "testpass123",
                "email": "test@example.com",
                "first_name": "Test",
                "last_name": "User",
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_signup_missing_fields(self):
        response = self.client.post(self.signup_url, {"username": "testuser"})
        self.assertEqual(response.status_code, 400)

    def test_login_success(self):
        User.objects.create_user("testuser", "test@example.com", "testpass123")
        response = self.client.post(
            self.login_url,
            {"username": "testuser", "password": "testpass123"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("loggedin", response.cookies)

    def test_login_invalid_credentials(self):
        response = self.client.post(
            self.login_url,
            {"username": "nonexistent", "password": "wrongpass"},
        )
        self.assertEqual(response.status_code, 401)

    def test_login_missing_fields(self):
        response = self.client.post(self.login_url, {})
        self.assertEqual(response.status_code, 400)

    def test_logout_success(self):
        user = User.objects.create_user("testuser", "test@example.com", "testpass123")
        self.client.force_login(user)
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 200)

    def test_logout_unauthenticated(self):
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 403)
