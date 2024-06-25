import random, string, time
from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.nombre

class SubCategory(models.Model):
    parent = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='subcategory'
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.nombre
    
class SubCategories(models.Model):
    parent = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class BaseCategories(models.Model):
    parent = models.ForeignKey(SubCategories, on_delete=models.CASCADE, related_name='basecategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(
        BaseCategories, on_delete=models.CASCADE, related_name='products',
    null=True, blank=True)
    status = models.CharField(max_length=255, default='Inactivo')
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', blank=True)

    def __str__(self):
        return self.title
    
    def get_total_stock(self):
        """Calculates the total stock of all variants associated with this product."""
        return self.variant_set.aggregate(total_stock=models.Sum('stock'))['total_stock'] or 0
    
    def get_categories(self):
        """Obtiene la jerarquía completa de categorías para el producto."""
        category_hierarchy = {}  # Usa un diccionario para organizar las categorías

        # Obtener la categoría base (BaseCategories)
        base_category = self.category  # Suponiendo que `category` en Product es una referencia a BaseCategories

        if base_category:
            category_hierarchy['category'] = base_category.name

            # Obtener la subcategoría (SubCategories)
            subcategory = base_category.parent
            if subcategory:
                category_hierarchy['subcategory'] = subcategory.name

                # Obtener la subcategoría (SubCategory)
                subcategory_parent = subcategory.parent
                if subcategory_parent:
                    category_hierarchy['subcategory2'] = subcategory_parent.name

                    # Obtener la categoría principal (Category)
                    category = subcategory_parent.parent
                    if category:
                        category_hierarchy['subcategory3'] = category.name
        
        return category_hierarchy  

class Variant(models.Model):
    status = models.CharField(max_length=255, default='Inactivo')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    color = models.CharField(max_length=50, blank=True)
    size = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to='products/variants/', blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True, blank=True) # Agregar campo SKU
    
    def __str__(self):
        return f"{self.product.title} - {self.color} - {self.size}"
    
    def get_parent(self):
        """Devuelve el nombre del producto padre."""
        return self.product.title
    
    def generate_sku(self):
        random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        timestamp = int(time.time())
        sku = f'{random_string}-{timestamp}'
        counter = 1
        unique_sku = sku
        while Variant.objects.filter(sku=unique_sku).exists():
            unique_sku = f'{sku}-{counter}'
            counter += 1

        return unique_sku
    
    def get_color(self):
        """Genera un div con el color en estilo Tailwind."""
        color_code = self.color  # Suponiendo que el campo "color" tiene el código CSS

        if color_code:
            # Eliminar los espacios en blanco y convertir a minúsculas
            color_code = color_code.strip().lower()

            return color_code
        else:
            return ""  # Devuelve una cadena vacía si no hay color

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = self.generate_sku()

        super().save(*args, **kwargs)

class Service(models.Model):
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=255, default='Inactivo')
    description = models.TextField()
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    subcategory = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='services', null=True, blank=True
    )

    def __str__(self):
        return self.title

    def get_subcategory_name(self):
        """Returns the name of the subcategory if it exists, otherwise returns 'N/A'."""
        if self.subcategory:
            return self.subcategory.name
        else:
            return 'N/A'
    
    def get_total_profit(self):
        """Calculates the total profit for all variants of this Service."""
        total_profit = 0
        for variant in self.servicevariant_set.all():
            total_profit += variant.get_profit()
        return total_profit
    
class ServiceVariant(models.Model):
    status = models.CharField(max_length=255, default='Inactivo')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='services/modules/', blank=True) 
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.service.title} - {self.price}"
    
    def get_parent(self):
        """Devuelve el nombre del producto padre."""
        return self.service.title
    
    def get_profit(self):
        """Calculates the total sales generated by this ServiceVariant."""
        # Use the related_name 'servicevariant' from OrderItem
        
        total_sales = self.orderitem_set.filter(service_variant=self).aggregate(
            total_price=models.Sum('price')
        )['total_price']
        return total_sales or 0  # Return 0 if no sales found
    
class Order(models.Model):
    """ user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True) """
    status = models.CharField(max_length=50, default='Pending')  # Pending, Processing, Completed, Cancelled
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping_address = models.CharField(max_length=255, blank=True)
    billing_address = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Order #{self.id}"

    def get_total_price(self):
        """Calculates the total price of all items in the order."""
        total = 0
        for item in self.orderitem_set.all():
            total += item.price * item.quantity
        return total

    def get_total_quantity(self):
        """Calculates the total quantity of all items in the order."""
        return self.orderitem_set.aggregate(total_quantity=models.Sum('quantity'))['total_quantity'] or 0

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='orderitems')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)  # Product if available
    variant = models.ForeignKey(Variant, on_delete=models.SET_NULL, blank=True, null=True)  # Variant if available
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, blank=True, null=True) # Service if available
    service_variant = models.ForeignKey(ServiceVariant, on_delete=models.SET_NULL, blank=True, null=True)  # Service variant if available
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        if self.product:
            return f"{self.quantity}x {self.product.title}"
        elif self.service:
            return f"{self.quantity}x {self.service.title}"
        else:
            return "OrderItem"

    def get_total_price(self):
        """Calculates the total price for this order item."""
        return self.price * self.quantity