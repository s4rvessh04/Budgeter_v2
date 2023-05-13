from django.contrib.auth.models import User

from rest_framework.serializers import ModelSerializer, SerializerMethodField


class UserSerializer(ModelSerializer):
    full_name = SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name"]

    def get_full_name(self, obj):
        return obj.get_full_name()
