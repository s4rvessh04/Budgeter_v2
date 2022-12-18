from django.urls import path, include
from knox import views as knox_views

from . import views

urlpatterns = [
    path("", views.api_home),
    path("auth/validate/", views.ValidateToken.as_view()),
    path("auth/login/", views.LoginView.as_view(), name="knox_login"),
    path("auth/logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("auth/logoutall/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
    path("expenses/", include("expense.urls")),
    path("friends/", include("friend.urls")),
]
