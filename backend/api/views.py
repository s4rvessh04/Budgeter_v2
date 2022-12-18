from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication


def api_home(request, *args, **kwargs):
    return JsonResponse({"message": "Hello World"})


class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]


class ValidateToken(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        print(request.user)
        content = {"detail": "Valid Token."}
        return JsonResponse(content)
