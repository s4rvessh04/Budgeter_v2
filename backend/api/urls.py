from django.urls import path, include

from . import views

urlpatterns = [
    path("", views.HomeView.as_view()),
    path("healthz/", views.HealthCheckView.as_view()),
    path("auth/login/", views.LoginView.as_view()),
    path("auth/signup/", views.SignupView.as_view()),
    path("auth/logout/", views.LogoutView.as_view()),
    path("auth/csrf/", views.GetCSRFTokenView.as_view()),
    path("expenses/", include("expense.urls")),
    path("friends/", include("friend.urls")),
    path("users/", include("user.urls")),
]
