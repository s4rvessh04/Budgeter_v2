from rest_framework import serializers

from .models import Friend
from user.serializers import UserSerializer


class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        exclude = ["user"]

    def get_friend(self, obj):
        print(obj)
        return UserSerializer(obj.friend).data


class FriendCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ["friend", "status"]

    def validate(self, attrs):
        if attrs["friend"] == self.context["request"].user:
            raise serializers.ValidationError("You cannot add yourself as a friend.")
        return attrs
