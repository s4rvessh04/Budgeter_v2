from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication


class HomeView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Django Rest Framework - Home"})


class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data["username"]
        password = request.data["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            response = Response({"detail": "Logged in."})
            response.set_cookie(
                "loggedin", True, samesite="lax", max_age=1209600, path="/"
            )
            return response
        return Response({"detail": "Invalid credentials."})


class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        logout(request)
        response = Response({"detail": "Logged out."})
        response.delete_cookie("loggedin")
        return response


class ValidateToken(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        content = {"detail": "Valid Token."}
        return Response(content)
