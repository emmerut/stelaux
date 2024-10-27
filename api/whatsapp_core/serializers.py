from rest_framework import serializers
from .models import WhatsAppMessage, WhatsAppContact, WhatsAppTemplate, WhatsAppButton, WhatsAppMessageTemplate

class WhatsAppMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppMessage
        fields = "__all__"

class WhatsAppContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppContact
        fields = "__all__"

class WhatsAppTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppTemplate
        fields = "__all__"

class WhatsAppButtonSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppButton
        fields = "__all__"

class WhatsAppMessageTemplateSerializer(serializers.ModelSerializer):
    message = WhatsAppMessageSerializer(read_only=True)
    template = WhatsAppTemplateSerializer(read_only=True)
    buttons = WhatsAppButtonSerializer(many=True, read_only=True)

    class Meta:
        model = WhatsAppMessageTemplate
        fields = "__all__"
