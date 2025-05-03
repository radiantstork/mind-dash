from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('verbal-memory/tests/', views.VerbalMemoryTestView.as_view(), name='verbal-memory-tests'),
    path('verbal-memory/random-word/', views.RandomWordView.as_view(), name='random-word'),
    path('chimp-test/', views.ChimpTestView.as_view(), name='chimp-test'),
path('verbal-memory/user-score-history/', views.user_score_history, name='user-score-history'),
path('verbal-memory/score-distribution/', views.score_distribution, name='score-distribution'),
]