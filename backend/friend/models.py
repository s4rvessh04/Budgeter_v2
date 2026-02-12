from django.contrib.auth.models import User
from django.db import models


class Friend(models.Model):
    # Field Options
    STATUS_TYPES = (
        ("A", "Accepted"),
        ("R", "Rejected"),
        ("P", "Pending"),
    )

    # Fields
    update_dt = models.DateTimeField(auto_now=True)
    create_dt = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=STATUS_TYPES)

    # Related Fields
    user = models.ForeignKey(User, related_name="friends", on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name="friend_of", on_delete=models.CASCADE)
