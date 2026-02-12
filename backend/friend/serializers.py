from rest_framework import serializers

from .models import Friend
from user.serializers import UserSerializer


class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        fields = "__all__"

    def get_friend(self, obj):
        return UserSerializer(obj.friend).data

    def get_user(self, obj):
        return UserSerializer(obj.user).data


class FriendCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ["friend", "status"]

    def validate(self, attrs):
        if attrs["friend"] == self.context["request"].user:
            raise serializers.ValidationError("You cannot add yourself as a friend.")
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
