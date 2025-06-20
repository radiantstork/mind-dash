from django.urls import path
from .views import LoginView, RegisterView, LogoutView, ProtectedDataView, GameResultCreateView, get_csrf_token, UserStatisticsView
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    
    # path('verbal-memory/tests/', views.VerbalMemoryTestView.as_view(), name='verbal-memory-tests'),
    # path('verbal-memory/random-word/', views.RandomWordView.as_view(), name='random-word'),
    # path('number-memory/tests/', views.NumberMemoryTestView.as_view(), name='number-memory-tests'),
    # path('chimp-test/', views.ChimpTestView.as_view(), name='chimp-test'),
    # path('user-score-history/', views.user_score_history, name='user-score-history'),
    # path('score-distribution/', views.score_distribution, name='score-distribution'),

    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('protected-data/', ProtectedDataView.as_view(), name='protected-data'),
    path('csrf/', get_csrf_token),
    path('submit/', GameResultCreateView.as_view(), name='game-results-create'),
    path('user-statistics/', UserStatisticsView.as_view(), name='user-statistics'),
]