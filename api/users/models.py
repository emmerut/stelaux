from django.utils import timezone
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.db.models.signals import post_save

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    profile = models.ImageField(upload_to='perfiles', blank=True, null=True)
    birthday = models.DateField(null=True, blank=True)
    plan_startups = models.BooleanField(default=False)
    plan_ecommerce = models.BooleanField(default=False)
    plan_ultimate = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    id_verified = models.BooleanField(default=False)
    profile_complete = models.BooleanField(default=False)
    customer_id = models.CharField(max_length=255, null=True, blank=True)

    @property
    def active_plan(self):
        if self.plan_ultimate:
            return "Ultimate"
        elif self.plan_ecommerce:
            return "Ecommerce"
        elif self.plan_startups:
            return "Startups"
        else:
            return "Free"

    @property
    def email_display(self):
        return self.email if self.email else "Ingrese Información"

    @property
    def phone_display(self):
        return self.phone if self.phone else "Ingrese Información"

    @property
    def address_display(self):
        return self.address if self.address else "Ingrese Información"
    
class Message(models.Model):
    # sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_messages') master
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username} to {self.recipient.username}: {self.content[:20]}"

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}: {self.message}"

class BusinessData(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='business_data')
    business_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='business_logos', blank=True, null=True)
    dark_logo = models.ImageField(upload_to='business_logos', blank=True, null=True)

    def __str__(self):
        return self.business_name
    
# Example of creating a notification:
# user = CustomUser.objects.get(pk=1)  # Replace with the user you want to notify
# notification = Notification.objects.create(user=user, message="New message received!")

