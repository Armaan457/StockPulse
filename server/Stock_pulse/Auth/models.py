# username, email, passwd, phone num, full name
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, full_name, phone_number, password = None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        if not email:
            raise ValueError('The Email field must be set')
        if not full_name:
            raise ValueError('The Full Name field must be set')
        if not phone_number:
            raise ValueError('The Phone Number must be set')
        email = self.normalize_email(email)
        user = self.model(username = username, email = email, full_name = full_name, phone_number = phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, full_name, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(username, email, full_name, phone_number, password, **extra_fields)

# Custom User Model using AbstractBaseUser class i.e. defining all fields from scratch
class CustomUser(AbstractBaseUser, PermissionsMixin):
    #user related fields
    username = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15, unique = True)
    email = models.EmailField(unique = True)
    # admin related fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    # miscellaneous fields
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['full_name', 'phone_number', 'email']

    def __str__(self):
        return self.username