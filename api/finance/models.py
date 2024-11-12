from django.db import models
from users.models import CustomUser
from inventory.models import Variant, ServiceVariant

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
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Info de cliente de {self.owner.first_name} con ID: {self.owner.id}"
    
class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_DEFAULT, related_name='orders', default=None)
    invoice_id = models.CharField(max_length=255, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)  
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)  
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)  
    created_at = models.DateTimeField(auto_now=True)
    delivery_date = models.DateField(default=None, blank=True, null=True)
    
    def __str__(self):
        return f"Orden de {self.customer.name} con ID: {self.id}"
    
    @classmethod
    def generate_invoice_id(cls):
        last_invoice_id = Order.objects.all().order_by('-invoice_id').first()
        if last_invoice_id:
            new_invoice_id = int(last_invoice_id.invoice_id.lstrip('INV-')) + 1
        else:
            new_invoice_id = 1
        return f"INV-{new_invoice_id:08d}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_id:
            self.invoice_id = self.generate_invoice_id()
        super().save(*args, **kwargs)

class BillingItems(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='billing_items')
    product = models.ForeignKey(Variant, on_delete=models.CASCADE, related_name='product_item', blank=True, null=True)
    service = models.ForeignKey(ServiceVariant, on_delete=models.CASCADE, related_name='service_item', blank=True, null=True)
    qty = models.IntegerField()  # cantidad
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    

    @property
    def owner_id(self):
        return self.order.customer.user.id

    def __str__(self):
        return f"Ítem de facturación de la orden {self.order.id}"
    