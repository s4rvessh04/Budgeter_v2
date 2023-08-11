from django.db.models import Q
from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Friend
from user.serializers import UserSerializer
from .serializers import (
    FriendSerializer,
    FriendCreateUpdateSerializer,
)


class FriendCreateListAPIView(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
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


class FriendUpdateAPIView(generics.UpdateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FriendCreateUpdateSerializer
    queryset = Friend.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(
            Q(user=self.request.user) | Q(friend=self.request.user)
        ).all()


class FriendDestroyAPIView(generics.DestroyAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FriendCreateUpdateSerializer
    queryset = Friend.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(
            Q(user=self.request.user) | Q(friend=self.request.user)
        ).all()


class PendingListAPIView(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def get_queryset(self):
        return self.queryset.filter(Q(friend=self.request.user), status="P").all()


class RejectListAPIView(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def get_queryset(self):
        return self.queryset.filter(Q(user=self.request.user), status="R").all()


class FriendsDiscoverAPIView(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Friend.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user

        friend_ids = Friend.objects.filter(Q(user=user) | Q(friend=user)).values_list(
            "user_id", "friend_id"
        )

        friend_ids = [id for ids in friend_ids for id in ids if id != user.id]
        print(friend_ids)

        users_not_friends = User.objects.exclude(
            Q(id__in=friend_ids) | Q(id=user.id) | Q(is_superuser=True)
        )

        return users_not_friends.all()
