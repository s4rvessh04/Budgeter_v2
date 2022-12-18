from rest_framework import generics

from .models import Friend
from .serializers import FriendSerializer


class FriendListCreateAPIView(generics.ListCreateAPIView):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def perform_create(self, serializer):
        return super().perform_create(serializer)
