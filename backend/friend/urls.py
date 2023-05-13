from django.urls import path

from . import views

urlpatterns = [
    path("", views.FriendListCreateAPIView.as_view()),
    path("?friend=<str:friend>/", views.FriendListCreateAPIView.as_view()),
]
