from django.urls import path

from . import views

urlpatterns = [
    path("", views.ExpenseListCreateAPIView.as_view()),
    path("<int:pk>/", views.ExpenseRetrieveAPIView.as_view()),
    path("<int:pk>/update", views.ExpenseUpdateAPIView.as_view()),
    path("<int:pk>/delete", views.ExpenseDestroyAPIView.as_view()),
    path("shared/", views.SharedExpenseListAPIView.as_view()),
    path("shared/<int:pk>/", views.SharedExpenseRetrieveAPIView.as_view()),
    path("shared/<int:pk>/update", views.SharedExpenseUpdateAPIView.as_view()),
    path("shared/<int:pk>/delete", views.SharedExpenseDestroyAPIView.as_view()),
]
