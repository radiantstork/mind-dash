from django.contrib.auth.models import AnonymousUser, AbstractUser
from django.db import models
from django.contrib.auth import get_user_model

class User(AbstractUser):
    class Meta:
        app_label = 'api'
        db_table = 'users'
    score = models.IntegerField(default=0)

    def __str__(self):
        return self.username


User = get_user_model()

class GameResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_results')
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    test_name = models.CharField(max_length=50)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.score} - {self.created_at}"


class WordPool(models.Model):
    word = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.word

# class VerbalMemoryTest(models.Model):
#     user = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         null=True,  # Crucial for anonymous users
#         blank=True,
#         default=None
#     )
#     score = models.IntegerField(default=0)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-score']

#     def __str__(self):
#         return f"{self.user.username}'s Verbal Memory Test (Score: {self.score})"

# class ChimpTest(models.Model):
#     user = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True
#     )
#     score = models.IntegerField()  # Highest level achieved
#     sequence_length = models.IntegerField()  # Longest correct sequence
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-score', '-sequence_length']

#     def __str__(self):
#         return f"{self.user or 'Anonymous'} - Level {self.score}"


# class NumberMemoryTest(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     score = models.IntegerField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-score', 'created_at']