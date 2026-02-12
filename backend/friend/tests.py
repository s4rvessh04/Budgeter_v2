from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Friend


class FriendTestCase(TestCase):
    """Tests for friend request workflows."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user("testuser", "test@example.com", "pass123")
        self.other = User.objects.create_user("other", "other@example.com", "pass123")
        self.client.force_login(self.user)
        self.base_url = "/api/friends/"

    def test_send_friend_request(self):
        response = self.client.post(
            self.base_url,
            {"friend": self.other.id, "status": "P"},
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Friend.objects.count(), 1)
        friend_req = Friend.objects.first()
        self.assertEqual(friend_req.user, self.user)
        self.assertEqual(friend_req.friend, self.other)
        self.assertEqual(friend_req.status, "P")

    def test_accept_friend_request(self):
        friend_req = Friend.objects.create(
            user=self.other, friend=self.user, status="P"
        )
        response = self.client.patch(
            f"{self.base_url}{friend_req.pk}/update",
            {"status": "A", "friend": self.other.id},
        )
        self.assertEqual(response.status_code, 200)
        friend_req.refresh_from_db()
        self.assertEqual(friend_req.status, "A")

    def test_list_accepted_friends(self):
        Friend.objects.create(user=self.user, friend=self.other, status="A")
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_pending_list(self):
        Friend.objects.create(user=self.other, friend=self.user, status="P")
        response = self.client.get(f"{self.base_url}pending")
        self.assertEqual(response.status_code, 200)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)

    def test_reject_list(self):
        Friend.objects.create(user=self.user, friend=self.other, status="R")
        response = self.client.get(f"{self.base_url}reject")
        self.assertEqual(response.status_code, 200)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)

    def test_delete_friend(self):
        friend_req = Friend.objects.create(
            user=self.user, friend=self.other, status="A"
        )
        response = self.client.delete(f"{self.base_url}{friend_req.pk}/delete")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Friend.objects.count(), 0)

    def test_discover_non_friends(self):
        third = User.objects.create_user("third", "third@example.com", "pass")
        Friend.objects.create(user=self.user, friend=self.other, status="A")
        response = self.client.get(f"{self.base_url}discover")
        self.assertEqual(response.status_code, 200)
        results = response.data.get("results", response.data)
        usernames = [u["username"] for u in results]
        self.assertIn("third", usernames)
        self.assertNotIn("other", usernames)

    def test_unauthenticated_access(self):
        self.client.logout()
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 403)
