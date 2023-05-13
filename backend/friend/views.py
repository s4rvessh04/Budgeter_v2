from rest_framework import generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Friend
from .serializers import FriendSerializer, FriendCreateSerializer


class FriendListCreateAPIView(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def get_queryset(self):
        query_param = self.request.query_params.get("friend", "")

        if query_param:
            self.queryset = self.queryset.filter(friend__username__contains=query_param)

        if self.request.user.is_superuser:
            return self.queryset.all()
        return self.queryset.filter(user=self.request.user).all()

    def create(self, request, *args, **kwargs):
        self.serializer_class = FriendCreateSerializer
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
