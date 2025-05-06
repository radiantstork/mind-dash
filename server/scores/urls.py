from django.urls import path
from .views import submit_score

urlpatterns = [
    path("submit/", submit_score, name="submit-score"),
]
