from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    profile = models.ImageField(upload_to='perfiles', blank=True, null=True)
    plan_startups = models.BooleanField(default=False)
    plan_ecommerce = models.BooleanField(default=False)
    plan_ultimate = models.BooleanField(default=False)
    birthday = models.DateField(null=True, blank=True)