from django.db import models
from users.models import CustomUser as User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name

class DomainRegistration(models.Model):
    domain_name = models.CharField(max_length=255, unique=True)
    registration_date = models.DateField()
    registration_duration = models.IntegerField(blank=True, null=True)  # duración del registro en meses o años
    registration_type = models.CharField(max_length=255, blank=True, null=True)  # tipo de registro (por ejemplo, "comercial", "personal", etc.)
    registration_status = models.CharField(max_length=255, default="Pending", blank=True, null=True)  # estado del registro (por ejemplo, "activo", "pendiente", "vencido", etc.)
    registration_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # precio del registro
    payment_date = models.DateField(blank=True, null=True)  # fecha de pago
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='domain_registrations')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Registration of domain {self.domain_name} ({self.registration_status})"

class TemplateData(models.Model):
    proyect_name = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=255, default="Available")
    commercial_name = models.CharField(max_length=255, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='template_data')
    thumbnail = models.ImageField(upload_to='thumbnails/')
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.proyect_name} - {self.commercial_name}"

class PortalRequirements(models.Model):
    status = models.CharField(max_length=255, default="Pending")
    project_type = models.CharField(max_length=255)
    file_image = models.ImageField(upload_to='branding_logos/')
    primary_color = models.CharField(max_length=7)  # en formato HEX
    alternate_color = models.CharField(max_length=7)  # en formato HEX
    project_voice = models.TextField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='portal_requirements')
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Requerimiento de {self.user.username} para {self.project_type}"

class Portals(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portals')
    status = models.CharField(max_length=255, default="Pending")
    current_step = models.IntegerField(default=0)
    domain_registration = models.ForeignKey(DomainRegistration, on_delete=models.CASCADE, related_name='domains', blank=True, null=True)
    template_model = models.ForeignKey(TemplateData, on_delete=models.CASCADE, related_name='templates', blank=True, null=True)
    requirement_data = models.ForeignKey(PortalRequirements, on_delete=models.CASCADE, related_name='requirements', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

