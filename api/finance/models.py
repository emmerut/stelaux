from django.db import models
from users.models import CustomUser
from inventory.models import Product, Service

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

class Customer(models.Model):
    owner = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='customer_onwer')
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    fiscal_id = models.CharField(max_length=20)

    def __str__(self):
        return f"Info de cliente de {self.user.first_name} con ID: {self.user.id}"
    
class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    product = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='product_orders', blank=True, null=True)
    service = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='service_orders', blank=True, null=True)
    qty = models.IntegerField()  # cantidad
    price = models.DecimalField(max_digits=10, decimal_places=2)  
    tax = models.DecimalField(max_digits=10, decimal_places=2)  
    total = models.DecimalField(max_digits=10, decimal_places=2)  

    def __str__(self):
        return f"Orden de {self.customer.name} con ID: {self.id}"

    # podrías agregar una propiedad para calcular el total automáticamente
    @property
    def calculate_total(self):
        return self.price * self.qty + self.tax
    
    def save(self, *args, **kwargs):
        self.total = self.price * self.qty + self.tax
        super().save(*args, **kwargs)

class BillingItems(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='billing_items')
    total = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def owner_id(self):
        return self.order.customer.user.id

    def __str__(self):
        return f"Ítem de facturación de la orden {self.order.id}"
    
    def save(self, *args, **kwargs):
        self.total = self.order.total
        super().save(*args, **kwargs)
