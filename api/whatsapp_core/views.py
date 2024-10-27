from rest_framework import viewsets, status
from rest_framework.response import Response
from functions import get_user_from_token
from django.conf import settings
from rest_framework.decorators import action
from .serializers import WhatsAppMessageSerializer, WhatsAppContactSerializer, WhatsAppTemplateSerializer, WhatsAppButtonSerializer, WhatsAppMessageTemplateSerializer
from .models import WhatsAppMessage, WhatsAppContact, WhatsAppTemplate, WhatsAppButton, WhatsAppMessageTemplate
import requests

class WhatsAppMessageViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppMessage.objects.all()
    serializer_class = WhatsAppMessageSerializer

    @action(detail=False, methods=["post"])
    def send_message(self, request):
        # Envíar mensaje a través de la API de WhatsApp
        api_url = "https://graph.facebook.com/v13.0/"
        access_token = settings.WHATSAPP_ACCESS_TOKEN
        to = request.data["to"]
        text = request.data["text"]

        headers = {"Authorization": f"Bearer {access_token}"}
        payload = {"messaging_product": "whatsapp", "to": to, "type": "text", "text": {"body": text}}

        response = requests.post(api_url + "messages", headers=headers, json=payload)

        if response.status_code == 201:
            return Response({"message": "Mensaje enviado exitosamente"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": response.text}, status=response.status_code)

class WhatsAppContactViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppContact.objects.all()
    serializer_class = WhatsAppContactSerializer

class WhatsAppTemplateViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppTemplate.objects.all()
    serializer_class = WhatsAppTemplateSerializer

    def get_queryset(self):
        return self.queryset.filter(message__status="delivered")

    @action(detail=False, methods=["get"])
    def get_messages(self, request):
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        if user:
            messages = WhatsAppTemplate.objects.filter(user=user, message__status="delivered")
        else:
            messages = WhatsAppTemplate.objects.filter(message__status="delivered")
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

class WhatsAppButtonViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppButton.objects.all()
    serializer_class = WhatsAppButtonSerializer

class WhatsAppMessageTemplateViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppMessageTemplate.objects.all()
    serializer_class = WhatsAppMessageTemplateSerializer

    @action(detail=False, methods=["post"])
    def create_message_template(self, request):
        # Crear un mensaje a partir de un modelo
        template_id = request.data["template_id"]
        buttons = request.data["buttons"]

        template = WhatsAppTemplate.objects.get(id=template_id)
        message = WhatsAppMessage.objects.create(text=template.content)

        for button in buttons:
            WhatsAppButton.objects.create(label=button["label"], url=button["url"], type=button["type"])

        WhatsAppMessageTemplate.objects.create(message=message, template=template, buttons=buttons)

        return Response({"message": "Mensaje creado exitosamente"}, status=status.HTTP_201_CREATED)

