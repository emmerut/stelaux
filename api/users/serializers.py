from rest_framework import serializers
from .models import CustomUser as User
from django.db.models import Q
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
import datetime, jwt

def get_user_from_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        # Obtén el campo email o phone del payload
        recipient = payload.get('email') or payload.get('phone') or payload.get('user_id')

        if not recipient:
            raise AuthenticationFailed('Token inválido')

        user = User.objects.get(Q(email=recipient) | Q(phone=recipient) | Q(id=recipient))
        if not user.is_active:
            raise AuthenticationFailed('Usuario inactivo')
        return user

    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token ha expirado')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Token inválido')

class RegisterSerializer(serializers.ModelSerializer):
    email_or_phone = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    day = serializers.CharField(write_only=True)
    month = serializers.CharField(write_only=True)
    year = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email_or_phone', 'password', 'first_name', 'last_name', 'day', 'month', 'year']

    def validate_email_or_phone(self, value):
        # Buscar usuario con el email o teléfono proporcionado
        get_user = User.objects.filter(Q(email=value) | Q(phone=value)).first()
        
        if get_user:
            # Si el usuario existe y no está activo
            if not get_user.is_active:
                get_user.delete()  # Eliminar el usuario inactivo
            else:
                # Lanzar error si el usuario está activo
                raise serializers.ValidationError("Usuario ya ha sido registrado con este email o teléfono.")
        
        return value

    def create(self, validated_data):
        email_or_phone = validated_data.pop('email_or_phone')
        password = validated_data.pop('password')
        day = int(validated_data.pop('day'))
        month = int(validated_data.pop('month'))
        year = int(validated_data.pop('year'))
        birthday = datetime.date(year, month, day)
        
        user = User.objects.create_user(
            username=email_or_phone,
            email=email_or_phone if '@' in email_or_phone else '',
            phone=email_or_phone if '@' not in email_or_phone else '',
            password=password,
            birthday=birthday,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.is_active = False
        user.save()
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email_or_phone = serializers.CharField()

class PasswordResetSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField()

    def validate_token(self, value):
        user = get_user_from_token(value)
        if not user:
            raise serializers.ValidationError("Token inválido.")
        return value

    def save(self, **kwargs):
        token = self.validated_data['token']
        new_password = self.validated_data['new_password']
        user = get_user_from_token(token)

        # Establecer nueva contraseña
        user.set_password(new_password)
        user.save()