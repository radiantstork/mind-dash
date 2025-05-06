from django.db import models

class GameScore(models.Model):
    name = models.CharField(max_length=100, blank=True)  # optional name
    score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name or 'Anonymous'} - {self.score}"