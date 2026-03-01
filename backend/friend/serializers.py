from django.db import transaction
from django.db.models import Q

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
        request_user = self.context["request"].user
        friend_user = attrs["friend"]

        if friend_user == request_user:
            raise serializers.ValidationError("You cannot add yourself as a friend.")

        # Block duplicates: check both directions (A→B and B→A)
        if self.instance is None:  # only on create, not update
            existing = Friend.objects.filter(
                Q(user=request_user, friend=friend_user)
                | Q(user=friend_user, friend=request_user)
            ).first()
            if existing:
                raise serializers.ValidationError(
                    "A friend request already exists between you and this user."
                )

        return attrs

    def create(self, validated_data):
        request_user = self.context["request"].user
        friend_user = validated_data["friend"]
        validated_data["user"] = request_user

        with transaction.atomic():
            # Lock any existing rows between these two users to prevent races
            reverse_request = (
                Friend.objects.select_for_update()
                .filter(user=friend_user, friend=request_user, status="P")
                .first()
            )

            if reverse_request:
                # The other user already sent us a pending request → auto-accept
                reverse_request.status = "A"
                reverse_request.save()
                return reverse_request

            return super().create(validated_data)
