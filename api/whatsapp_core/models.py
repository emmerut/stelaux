from django.db import models
from django.conf import settings
from users.models import CustomUser  # Importa el modelo CustomUser

class WhatsAppMessage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='whatsapp_messages')
    message_id = models.CharField(max_length=255)
    sender_id = models.CharField(max_length=255)
    receiver_id = models.CharField(max_length=255)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, default="pending")

class WhatsAppContact(models.Model):
    phone_number = models.CharField(max_length=20)
    name = models.CharField(max_length=255)
    last_seen = models.DateTimeField(auto_now_add=True)

class WhatsAppTemplate(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=255)

class WhatsAppButton(models.Model):
    label = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    type = models.CharField(max_length=255)

class WhatsAppMessageTemplate(models.Model):
    message = models.ForeignKey(WhatsAppMessage, on_delete=models.CASCADE)
    template = models.ForeignKey(WhatsAppTemplate, on_delete=models.CASCADE)
    buttons = models.ManyToManyField(WhatsAppButton)

