from django.db import models
from users.models import CustomUser

# Create your models here.
class CashBalance(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='current_balance')
    status = models.CharField(max_length=20, default='pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    trans_id = models.CharField(max_length=255, blank=True)
    autorization_code= models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Balance actual de {self.user.first_name} con ID: {self.user.id}"
    
    def total_amount(self):
        return self.user.current_balance.aggregate(total=models.Sum('amount'))['total'] or 0

class Withdrawals(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='withdrawals')
    status = models.CharField(max_length=20, default='pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    trans_id = models.CharField(max_length=255, blank=True)
    autorization_code= models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Retiro de {self.amount} de {self.user.first_name} con ID: {self.user.id}"
    
    def total_amount(self):
        return self.user.withdrawals.aggregate(total=models.Sum('amount'))['total'] or 0