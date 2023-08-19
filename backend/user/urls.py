from django.urls import path

from . import views

urlpatterns = [
    path("", views.UserListAPIView.as_view()),
    path("whoami/", views.UserRetrieveAPIView.as_view()),
    path("?username=<str:username>/", views.UserListAPIView.as_view()),
    path("<str:username>/update/", views.UserUpdateAPIView.as_view()),
    path("<str:username>/check-password/", views.UserCheckPasswordAPIView.as_view()),
]
