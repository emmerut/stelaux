from django.db import models

class SimpleContent(models.Model):
    """Almacena formulario simple."""
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='user_content')
    section = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    options = models.CharField(max_length=255, blank=True, null=True)
    number = models.FloatField(blank=True, null=True)
    decimal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    urlfield = models.CharField(max_length=255, blank=True, null=True)
    file_image = models.ImageField(upload_to='media/', blank=True, null=True)
    file_doc = models.FileField(upload_to='docs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class DynamicField(models.Model):
    """Almacena campos dinámicos formsets."""
    parent = models.ForeignKey(SimpleContent, on_delete=models.CASCADE, related_name='fields', blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    options = models.CharField(max_length=255, blank=True, null=True)
    number = models.FloatField(blank=True, null=True)
    decimal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    urlfield = models.CharField(max_length=255, blank=True, null=True)
    file_image = models.ImageField(upload_to='media/', blank=True, null=True)
    file_doc = models.FileField(upload_to='docs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # ... otros tipos de campos según sea necesario (booleano, archivo, etc.)

    def __str__(self):
        return f"{self.parent.section}: {self.parent}"

