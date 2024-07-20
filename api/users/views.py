import jwt, datetime
from django.utils import timezone
from twilio.rest import Client
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework import status
from rest_framework.decorators import action
from .serializers import (
    RegisterSerializer,
    PasswordResetRequestSerializer,
    PasswordResetSerializer,
    UserSerializer,
)
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from functions import get_user_from_token
from .models import CustomUser as User
from django.db.models import Q


class UserViewSet(viewsets.ModelViewSet):
    def send_verification(
        self,
        account_sid,
        auth_token,
        service_sid,
        channel,
        recipient,
        channel_configuration,
    ):

        # Inicializar cliente de Twilio
        client = Client(account_sid, auth_token)
        # Construir los argumentos dinámicamente
        verification_args = {"to": recipient, "channel": channel}
        if channel_configuration:
            verification_args["channel_configuration"] = channel_configuration

        # Enviar el código de verificación
        verification = client.verify.v2.services(service_sid).verifications.create(
            **verification_args
        )

        return verification

    @action(detail=False, methods=["get"])
    def user_all_data(self, request):
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)

        data = UserSerializer(user).data
        return Response(data)

    @action(methods=["post"], detail=False)
    def login(self, request):
        username_or_email = request.data.get("username")
        password = request.data.get("password")

        try:
            user = User.objects.get(
                Q(email=username_or_email) | Q(phone=username_or_email)
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Autenticar con las credenciales
        user = authenticate(request, username=username_or_email, password=password)

        if user is not None:
            # Generar token de autenticación
            payload = {
                "user_id": user.id,
                "exp": timezone.now()
                + timezone.timedelta(days=1),  # Token expiration in 1 hour
            }
            session_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
            return Response({"token": session_token}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    @action(methods=["post"], detail=False)
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        twilio_sid = request.data.get("twilio_sid")
        twilio_auth_token = request.data.get("twilio_auth_token")
        service_sid_sms = request.data.get("service_sid_sms")
        service_sid_email = request.data.get("service_sid_email")
        template_id = request.data.get("template_id")
        from_ = request.data.get("from")
        from_name = request.data.get("from_name")

        if serializer.is_valid():
            user = serializer.save()
            payload = {
                "exp": timezone.now()
                + datetime.timedelta(days=1),  # Expiración del token
            }
            if user.email:
                payload["email"] = user.email
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
                arguments = (
                    twilio_sid,
                    twilio_auth_token,
                    service_sid_email,
                    "email",
                    user.email,
                    {
                        "template_id": template_id,
                        "from": from_,
                        "from_name": from_name,
                    },
                )
                self.send_verification(*arguments)
                return Response({"call": "email", "token": token})
            elif user.phone:
                payload["phone"] = user.phone
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
                arguments = (
                    twilio_sid,
                    twilio_auth_token,
                    service_sid_sms,
                    "sms",
                    user.phone,
                )
                self.send_verification(*arguments)
                return Response({"call": "phone", "token": token})
            else:
                print(serializer.errors)
                return Response(
                    {"error": "No se especificó canal de verificación"}, status=400
                )
        else:
            return Response(serializer.errors, status=400)

    @action(methods=["post"], detail=False)
    def verify(self, request):
        account_sid = request.data.get("twilio_sid")
        auth_token = request.data.get("twilio_auth_token")
        service_sid_sms = request.data.get("service_sid_sms")
        service_sid_email = request.data.get("service_sid_email")
        token = request.data.get("token")
        code = request.data.get("code")

        if not all([account_sid, auth_token, token, code]):
            return Response(
                {"detail": "Información incompleta."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            # Obtén el campo email o phone del payload
            recipient = payload.get("email") or payload.get("phone")

            if not recipient:
                raise AuthenticationFailed("Token inválido")

            user = User.objects.get(Q(email=recipient) | Q(phone=recipient))
            service_sid = service_sid_email if "email" in payload else service_sid_sms

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expirado")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Token inválido")
        except User.DoesNotExist:
            raise AuthenticationFailed("Usuario no encontrado")
        except AuthenticationFailed as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        client = Client(account_sid, auth_token)
        try:
            client = Client(account_sid, auth_token)

            verification_check = client.verify.v2.services(
                service_sid
            ).verification_checks.create(to=recipient, code=code)

            if verification_check.status == "approved":
                if verification_check.channel == "sms":
                    user.phone_verified = True
                elif verification_check.channel == "email":
                    user.email_verified = True
                user.is_active = True
                user.save()
                payload = {
                    "user_id": user.id,
                    "exp": timezone.now() + timezone.timedelta(hours=1),
                }
                session_token = jwt.encode(
                    payload, settings.SECRET_KEY, algorithm="HS256"
                )

                return Response(
                    {
                        "detail": "Cuenta verificada exitosamente.",
                        "token": session_token,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"detail": "Código de verificación incorrecto o expirado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=False)
    def password_reset_request(self, request):
        twilio_sid = request.data.get("twilio_sid")
        twilio_auth_token = request.data.get("twilio_auth_token")
        service_sid_sms = request.data.get("service_sid_sms")
        service_sid_email = request.data.get("service_sid_email")
        template_id = request.data.get("template_id")
        from_ = request.data.get("from")
        from_name = request.data.get("from_name")
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email_or_phone = serializer.validated_data["email_or_phone"]
            user = User.objects.filter(
                Q(email=email_or_phone) | Q(phone=email_or_phone)
            ).first()
            if not user:
                return Response(
                    {"detail": "Email o teléfono no registrado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            payload = {
                "exp": timezone.now()
                + datetime.timedelta(days=1),  # Expiración del token
            }
            if user.email:
                payload["email"] = user.email
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
                arguments = (
                    twilio_sid,
                    twilio_auth_token,
                    service_sid_email,
                    "email",
                    user.email,
                    {
                        "template_id": template_id,
                        "from": from_,
                        "from_name": from_name,
                    },
                )
                self.send_verification(*arguments)
                return Response({"call": "email_reset", "token": token})
            elif user.phone:
                payload["phone"] = user.phone
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
                arguments = (
                    twilio_sid,
                    twilio_auth_token,
                    service_sid_sms,
                    "sms",
                    user.phone,
                )
                self.send_verification(*arguments)
                return Response({"call": "phone_reset", "token": token})
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=False)
    def password_reset_confirm(self, request):
        account_sid = request.data.get("twilio_sid")
        auth_token = request.data.get("twilio_auth_token")
        service_sid_sms = request.data.get("service_sid_sms")
        service_sid_email = request.data.get("service_sid_email")
        token = request.data.get("token")
        code = request.data.get("code")

        if not all(
            [account_sid, auth_token, service_sid_sms, service_sid_email, token, code]
        ):
            return Response(
                {"detail": "Información incompleta."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            # Obtén el campo email o phone del payload
            recipient = payload.get("email") or payload.get("phone")

            if not recipient:
                raise AuthenticationFailed("Token inválido")

            user = User.objects.get(Q(email=recipient) | Q(phone=recipient))
            service_sid = service_sid_email if "email" in payload else service_sid_sms

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expirado")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Token inválido")
        except User.DoesNotExist:
            raise AuthenticationFailed("Usuario no encontrado")
        except AuthenticationFailed as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        client = Client(account_sid, auth_token)
        try:
            client = Client(account_sid, auth_token)

            verification_check = client.verify.v2.services(
                service_sid
            ).verification_checks.create(to=recipient, code=code)

            if verification_check.status == "approved":
                payload = {
                    "user_id": user.id,
                    "exp": timezone.now() + timezone.timedelta(hours=1),
                }
                session_token = jwt.encode(
                    payload, settings.SECRET_KEY, algorithm="HS256"
                )

                return Response(
                    {
                        "detail": "Cuenta verificada exitosamente.",
                        "token": session_token,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"detail": "Código de verificación incorrecto o expirado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=False)
    def new_password(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(
                    {"detail": "Contraseña actualizada correctamente"},
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(serializer.errors)
            return Response(
                {"detail": "falla en la validacion"}, status=status.HTTP_400_BAD_REQUEST
            )
