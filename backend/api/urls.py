from django.urls import path, include
from knox import views as knox_views

from . import views

urlpatterns = [
    path("", views.HomeView.as_view()),
    path("auth/validate/", views.ValidateToken.as_view()),
    path("auth/login/", views.LoginView.as_view()),
    path("auth/logout/", views.LogoutView.as_view()),
    path("auth/logoutall/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
    path("expenses/", include("expense.urls")),
    path("friends/", include("friend.urls")),
]
