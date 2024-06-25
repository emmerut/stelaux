from django.db import models
from users.models import CustomUser

# Create your models here.
class CurrentBalance(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='current_balance')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Balance actual de {self.user.username}"
    
    def total_amount(self):
        return self.user.current_balances.aggregate(total=models.Sum('amount'))['total'] or 0

class PendingBalance(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='pending_balances')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Saldo pendiente de {self.user.username}"
    
    def total_amount(self):
        return self.user.pending_balances.aggregate(total=models.Sum('amount'))['total'] or 0

class Withdrawals(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='withdrawals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Retiro de {self.amount} de {self.user.username}"
    
    def total_amount(self):
        return self.user.withdrawals.aggregate(total=models.Sum('amount'))['total'] or 0