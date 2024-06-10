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

class Variant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    color = models.CharField(max_length=50, blank=True)
    size = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to='products/variants/', blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True, blank=True) # Agregar campo SKU
    
    def __str__(self):
        return f"{self.product.title} - {self.color} - {self.size}"
    
    def generate_sku(self):
        """Generates a SKU based on product title, color, and size."""

        # 1. Create a slug from the product title (for better readability)
        slug = slugify(self.product.title)

        # 2. Append color and size (if available)
        if self.color:
            slug += f'-{self.color}'
        if self.size:
            slug += f'-{self.size}'

        # 3. Ensure uniqueness by adding a counter if needed (optional)
        counter = 1
        while Variant.objects.filter(sku=slug).exists():
            slug = f'{slug}-{counter}'
            counter += 1

        return slug
    
    def save(self, *args, **kwargs):
        # Generate SKU if it doesn't exist
        if not self.sku:
            self.sku = self.generate_sku()

        super().save(*args, **kwargs)

class Service(models.Model):
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=255, default='Inactivo')
    description = models.TextField()
    image = models.ImageField(upload_to='services/', blank=True)
    subcategory = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='services', null=True, blank=True
    )

    def __str__(self):
        return self.title

class ServiceVariant(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='services/modules/', blank=True) 
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.service.title} - {self.duration} - {self.price}"