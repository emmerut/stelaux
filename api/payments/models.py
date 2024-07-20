from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils import timezone
from datetime import timedelta
from users.models import CustomUser

# Create your models here.
class Subscription(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.CharField(max_length=20, choices=[
        ("Free", "Free"),
        ("Starter", "Starter"),
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

class Billing(models.Model):
    subscription = models.OneToOneField(Subscription, on_delete=models.CASCADE, related_name='stela_billing')
    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)  
    stripe_subscription_id = models.CharField(max_length=255, null=True, blank=True)
    payment_method = models.CharField(max_length=255, null=True, blank=True)  
    last_payment_date = models.DateTimeField(null=True, blank=True)
    next_billing_date = models.DateTimeField(null=True, blank=True)
    amount_due = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Billing for {self.subscription.user.username} - {self.subscription.plan}"

    def update_billing_info(self, stripe_customer_id, stripe_subscription_id, payment_method):
        self.stripe_customer_id = stripe_customer_id
        self.stripe_subscription_id = stripe_subscription_id
        self.payment_method = payment_method
        self.save()

    def calculate_next_billing_date(self):
        if self.last_payment_date is None:  
            self.next_billing_date = self.subscription.start_date + timedelta(days=15) 
        else:
            self.next_billing_date = self.last_payment_date + timedelta(days=30)  # 30-day billing cycle
        self.save()

class PaymentIntent(models.Model):
    status = models.CharField(max_length=50, default='pending')
    transaction_type = models.CharField(max_length=50, default='purchase')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payment_intents')
    product_name = models.CharField(max_length=255, null=True, blank=True)  
    client_secret = models.CharField(max_length=255, null=True, blank=True)  
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='usd')
    annually = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment Intent for {self.user.username} - {self.product_name}"

    def mark_as_succeeded(self):
        self.status = 'succeeded'
        self.save()

    def mark_as_failed(self):
        self.status = 'failed'
        self.save()

class PaymentMethods(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payment_methods')
    method_type = models.CharField(max_length=50)
    provider = models.CharField(max_length=50, null=True, blank=True)  
    token = models.CharField(max_length=255, null=True, blank=True)  
    last_four_digits = models.CharField(max_length=4, null=True, blank=True)  
    expiry_date = models.DateField(null=True, blank=True)  
    is_default = models.BooleanField(default=False)  

    def __str__(self):
        return f"{self.user.username} - {self.method_type}"

    def set_as_default(self):
        """Sets this payment method as the default for the user."""
        self.user.payment_methods.update(is_default=False)  
        self.is_default = True
        self.save()
