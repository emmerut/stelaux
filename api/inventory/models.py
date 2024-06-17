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
        # Generate SKU if it doesn't exist
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
    
class ServiceVariant(models.Model):
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