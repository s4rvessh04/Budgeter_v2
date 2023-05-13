from django.urls import path

from . import views

urlpatterns = [
    path("", views.UserListAPIView.as_view()),
    path("?username=<str:username>/", views.UserListAPIView.as_view()),
    # path("<str:username>/", views.UserRetrieveAPIView.as_view()),
]
