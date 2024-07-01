import random, string
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
    plan_startups = models.BooleanField(default=False)
    plan_ecommerce = models.BooleanField(default=False)
    plan_ultimate = models.BooleanField(default=False)
    birthday = models.DateField(null=True, blank=True)

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

class Subscription(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.CharField(max_length=20, choices=[
        ("Free", "Free"),
        ("Startups", "Startups"),
        ("Ecommerce", "Ecommerce"),
        ("Ultimate", "Ultimate")
    ], default="Free")
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan}"

    def is_expired(self):
        return self.end_date is not None and self.end_date < timezone.now()

    def renew(self, new_plan):
        self.plan = new_plan
        self.end_date = timezone.now() + timedelta(days=30)  # Assuming 30 days for all plans
        self.save()

@receiver(post_save, sender=CustomUser)
def create_subscription(sender, instance, created, **kwargs):
    if created:
        Subscription.objects.create(user=instance)

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

# Example of creating a notification:
# user = CustomUser.objects.get(pk=1)  # Replace with the user you want to notify
# notification = Notification.objects.create(user=user, message="New message received!")