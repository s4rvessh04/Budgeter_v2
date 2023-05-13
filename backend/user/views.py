from django.contrib.auth.models import User

from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from .serializers import UserSerializer


class UserListAPIView(ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        if not self.request.user.is_superuser:
            return (
                self.queryset.exclude(username="admin")
                .exclude(username=self.request.user.username)
                .filter(
                    username__contains=self.request.query_params.get("username", "")
                )
                .all()
            )
        return self.queryset.all()


class UserRetrieveAPIView(RetrieveAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    def get_queryset(self):
        if not self.request.user.is_superuser:
            return (
                self.queryset.exclude(username="admin")
                .exclude(username=self.request.user.username)
                .all()
            )
        return self.queryset.all()
