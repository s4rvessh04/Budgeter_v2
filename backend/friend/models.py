from django.db import models


class Friend(models.Model):
    STATUS_TYPES = (
        ("A", "Accepted"),
        ("R", "Rejected"),
        ("P", "Pending"),
    )

    id = models.IntegerField(primary_key=True)
    # user_id = models.ForeignKey()
    # friend_id = models.ForeignKey()
    last_updated = models.DateTimeField()
    status = models.CharField(max_length=1, choices=STATUS_TYPES)
