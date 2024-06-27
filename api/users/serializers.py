from rest_framework import serializers
from .models import CustomUser as User
from django.db.models import Q
import datetime

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