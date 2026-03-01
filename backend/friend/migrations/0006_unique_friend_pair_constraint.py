from django.db import migrations, models
from django.db.models.functions import Greatest, Least


class Migration(migrations.Migration):

    dependencies = [
        ("friend", "0005_alter_friend_id"),
    ]

    operations = [
        migrations.AddConstraint(
            model_name="friend",
            constraint=models.UniqueConstraint(
                Least("user_id", "friend_id"),
                Greatest("user_id", "friend_id"),
                name="unique_friend_pair",
            ),
        ),
    ]
