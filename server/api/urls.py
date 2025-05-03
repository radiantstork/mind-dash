from django.urls import path
from .views import LoginView, RegisterView, LogoutView
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
]