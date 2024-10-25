from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here
class User(AbstractUser):
    username = models.CharField(max_length=255 , unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255,unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=15, unique = True)
    full_name = models.CharField(max_length=50)
    
    USERNAME_FIELD = 'username' #log in will be done via username and password
    REQUIRED_FIELDS = []
