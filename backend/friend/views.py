from django.db.models import Q
from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.response import Response

from service.mixins import AuthenticatedMixin

from .models import Friend
from user.serializers import UserSerializer
from .serializers import (
    FriendSerializer,
    FriendCreateUpdateSerializer,
)


class FriendCreateListAPIView(AuthenticatedMixin, generics.ListCreateAPIView):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def get(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            all_user_friends = self.queryset.filter(
                Q(user=self.request.user) | Q(friend=self.request.user), status="A"
            ).all()

            friends_list = []

            for data in all_user_friends:
                if data.user == self.request.user:
                    friends_list.append(
                        {
                            "id": data.id,
                            "status": data.status,
                            "friend": {
                                "id": data.friend.id,
                                "username": data.friend.username,
                                "full_name": data.friend.get_full_name(),
                            },
                        }
                    )
                else:
                    friends_list.append(
                        {
                            "id": data.id,
                            "status": data.status,
                            "friend": {
                                "id": data.user.id,
                                "username": data.user.username,
                                "full_name": data.user.get_full_name(),
                            },
                        }
                    )

            return Response(friends_list)
        return super().get(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.queryset = self.queryset.filter(user=self.request.user).all()
        self.serializer_class = FriendCreateUpdateSerializer
        return super().create(request, *args, **kwargs)


class FriendUpdateAPIView(AuthenticatedMixin, generics.UpdateAPIView):
    serializer_class = FriendCreateUpdateSerializer
    queryset = Friend.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(
            Q(user=self.request.user) | Q(friend=self.request.user)
        ).all()


class FriendDestroyAPIView(AuthenticatedMixin, generics.DestroyAPIView):
    serializer_class = FriendCreateUpdateSerializer
    queryset = Friend.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(
            Q(user=self.request.user) | Q(friend=self.request.user)
        ).all()


class PendingListAPIView(AuthenticatedMixin, generics.ListAPIView):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def get_queryset(self):
        return self.queryset.filter(Q(friend=self.request.user), status="P").all()


class RejectListAPIView(AuthenticatedMixin, generics.ListAPIView):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def get_queryset(self):
        return self.queryset.filter(Q(user=self.request.user), status="R").all()


class FriendsDiscoverAPIView(AuthenticatedMixin, generics.ListAPIView):
    queryset = Friend.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user

        friend_ids = Friend.objects.filter(Q(user=user) | Q(friend=user)).values_list(
            "user_id", "friend_id"
        )

        friend_ids = [id for ids in friend_ids for id in ids if id != user.id]

        users_not_friends = User.objects.exclude(
            Q(id__in=friend_ids) | Q(id=user.id) | Q(is_superuser=True)
        )

        return users_not_friends.all()
