from django.contrib.auth.models import AnonymousUser, AbstractUser
from django.db import models


class User(AbstractUser):
    class Meta:
        app_label = 'api'
    score = models.IntegerField(default=0)

    def __str__(self):
        return self.username


class VerbalMemoryTest(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,  # Crucial for anonymous users
        blank=True,
        default=None
    )
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"{self.user.username}'s Verbal Memory Test (Score: {self.score})"


class WordPool(models.Model):
    word = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.word

class ChimpTest(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    score = models.IntegerField()  # Highest level achieved
    sequence_length = models.IntegerField()  # Longest correct sequence
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score', '-sequence_length']

    def __str__(self):
        return f"{self.user or 'Anonymous'} - Level {self.score}"