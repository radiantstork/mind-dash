from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Custom fields can be added here if needed
    pass

    class Meta:
        db_table = 'users'