from django.urls import path
from .views import LoginView, RegisterView, LogoutView, ProtectedDataView, get_csrf_token
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('protected-data/', ProtectedDataView.as_view(), name='protected-data'),
    path('csrf/', get_csrf_token),
]