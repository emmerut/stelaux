from django.db import models
from users.models import CustomUser as User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class TemplateData(models.Model):
    proyect_name = models.CharField(max_length=255)
    commercial_name = models.CharField(max_length=255)
    categoria = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='template_data')
    domain = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.ImageField(upload_to='thumbnails/')

    def __str__(self):
        return f"{self.proyect_name} - {self.commercial_name}"

class PortalRequirements(models.Model):
    status = models.CharField(max_length=255)
    project_type = models.CharField(max_length=255)
    branding_logo = models.ImageField(upload_to='branding_logos/')
    primary_color = models.CharField(max_length=7)  # en formato HEX
    alternate_color = models.CharField(max_length=7)  # en formato HEX
    domain = models.CharField(max_length=255)
    project_voice = models.TextField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='portal_requirements')

    def __str__(self):
        return f"Requerimiento de {self.user.username} para {self.domain}"

class DomainRegistration(models.Model):
    domain_name = models.CharField(max_length=255, unique=True)
    registration_date = models.DateField()
    registration_duration = models.IntegerField()  # duración del registro en meses o años
    registration_type = models.CharField(max_length=255)  # tipo de registro (por ejemplo, "comercial", "personal", etc.)
    registration_status = models.CharField(max_length=255)  # estado del registro (por ejemplo, "activo", "pendiente", "vencido", etc.)
    registration_price = models.DecimalField(max_digits=10, decimal_places=2)  # precio del registro
    payment_date = models.DateField(blank=True, null=True)  # fecha de pago
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='domain_registrations')

    def __str__(self):
        return f"Registration of domain {self.domain_name} ({self.registration_status})"

class Portals(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portals')
    domain_registration = models.ForeignKey(DomainRegistration, on_delete=models.CASCADE, related_name='domains')
    template_model = models.ForeignKey(TemplateData, on_delete=models.CASCADE, related_name='templates')
