from django.urls import path

from . import views

urlpatterns = [
    path("", views.FriendCreateListAPIView.as_view()),
    path("<int:pk>/update", views.FriendUpdateAPIView.as_view()),
    path("<int:pk>/delete", views.FriendDestroyAPIView.as_view()),
    path("pending", views.PendingListAPIView.as_view()),
    path("reject", views.RejectListAPIView.as_view()),
    path("discover", views.FriendsDiscoverAPIView.as_view()),
]
