from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ParseError


class HomeView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Django Rest Framework - Home"})


class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


@method_decorator(ensure_csrf_cookie, name="dispatch")
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            raise ParseError("Please provide both username and password.", code=400)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            response = Response({"detail": "Logged in."})
            response.set_cookie(
                "loggedin", True, samesite="lax", max_age=1209600, path="/"
            )
            return response
        return Response({"detail": "Invalid credentials."}, status=401)


class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        logout(request)
        response = Response({"detail": "User is logged out."})
        response.delete_cookie("loggedin", path="/", samesite="lax")
        return response


@method_decorator(ensure_csrf_cookie, name="dispatch")
class SignupView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        email = request.data.get("email")

        if not username or not password or not email:
            raise ParseError("Please provide username, password and email.", code=400)

        try:
            user = User.objects.create_user(username, email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        except IntegrityError:
            return Response({"detail": "User already exists."}, status=400)

        return Response({"detail": "User created."}, status=201)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class GetCSRFTokenView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        return Response({"detail": "CSRF cookie set."})
