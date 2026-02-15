from django.contrib.auth.models import User

from rest_framework.generics import (
    ListAPIView,
    UpdateAPIView,
    CreateAPIView,
)
from rest_framework.response import Response

from service.mixins import AuthenticatedMixin

from .serializers import (
    UserSerializer,
    UserUpdateSerializer,
    UserCheckPasswordSerializer,
)


class UserListAPIView(AuthenticatedMixin, ListAPIView):
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


class UserRetrieveAPIView(AuthenticatedMixin, ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        if not self.request.user.is_superuser:
            return self.queryset.exclude(username="admin").all()
        return self.queryset.all()

    def get(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            return Response(self.get_serializer(self.request.user).data)
        return super().get(request, *args, **kwargs)


class UserUpdateAPIView(AuthenticatedMixin, UpdateAPIView):
    serializer_class = UserUpdateSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        if self.request.user != user:
            return Response(
                {"message": "You do not have permission to perform this action."},
                status=403,
            )
        return super().update(request, *args, **kwargs)


class UserCheckPasswordAPIView(AuthenticatedMixin, CreateAPIView):
    serializer_class = UserCheckPasswordSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    def post(self, request, *args, **kwargs):
        user = self.get_object()

        if self.request.user != user:
            return Response(
                {"message": "You do not have permission to perform this action."},
                status=403,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.validated_data["password"]):
            return Response({"message": "The password is incorrect."}, status=400)
        return Response({"message": "The password is correct."})
