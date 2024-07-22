from rest_framework import serializers
from payments.models import Billing
from .models import CustomUser as User
from django.db.models import Q
import datetime
from functions import get_user_from_token

from rest_framework import serializers
from .models import CustomUser, Notification, Message

class BillingSerializer(serializers.ModelSerializer):
    subscription = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Billing
        fields = (
            'id',
            'subscription',
            'stripe_customer_id',
            'stripe_subscription_id',
            'payment_method',
            'last_payment_date',
            'next_billing_date',
            'amount_due',
        )

class UserSerializer(serializers.ModelSerializer):
    notifications_count = serializers.SerializerMethodField()
    messages_count = serializers.SerializerMethodField()
    active_plan = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    email_verified = serializers.SerializerMethodField()
    phone_verified = serializers.SerializerMethodField()
    id_verified = serializers.SerializerMethodField()

    # Use the display properties for email, phone, and address
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    active_subscription = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "address",
            "profile",
            "plan_startups",
            "plan_ecommerce",
            "plan_ultimate",
            "birthday",
            "notifications_count",
            "messages_count",
            "active_plan",
            "full_name",
            "email_verified",
            "phone_verified",
            "id_verified",
            "active_subscription",
            "customer_id"
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "notifications_count",
            "messages_count",
            "active_plan",
            "customer_id"
        ]

    def get_active_subscription(self, obj):
        subscription = obj.subscriptions.all()
        if subscription:
            return BillingSerializer(subscription.billing).data
        return None

    def get_notifications_count(self, obj):
        return obj.notifications.filter(is_read=False).count()

    def get_messages_count(self, obj):
        return obj.received_messages.filter(is_read=False).count()

    def get_active_plan(self, obj):
        return obj.active_plan

    def get_full_name(self, obj):  # Define the get_full_name method
        return f"{obj.first_name} {obj.last_name}"

    def get_email(self, obj):
        return obj.email_display

    def get_phone(self, obj):
        return obj.phone_display

    def get_address(self, obj):
        return obj.address_display

    def get_email_verified(self, obj):
        return obj.email_verified

    def get_phone_verified(self, obj):
        return obj.phone_verified

    def get_id_verified(self, obj):
        return obj.id_verified

class RegisterSerializer(serializers.ModelSerializer):
    email_or_phone = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    day = serializers.CharField(write_only=True)
    month = serializers.CharField(write_only=True)
    year = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "email_or_phone",
            "password",
            "first_name",
            "last_name",
            "day",
            "month",
            "year",
        ]

    def validate_email_or_phone(self, value):
        # Buscar usuario con el email o teléfono proporcionado
        get_user = User.objects.filter(Q(email=value) | Q(phone=value)).first()

        if get_user:
            # Si el usuario existe y no está activo
            if not get_user.is_active:
                get_user.delete()  # Eliminar el usuario inactivo
            else:
                # Lanzar error si el usuario está activo
                raise serializers.ValidationError(
                    "Usuario ya ha sido registrado con este email o teléfono."
                )

        return value

    def create(self, validated_data):
        email_or_phone = validated_data.pop("email_or_phone")
        password = validated_data.pop("password")
        day = int(validated_data.pop("day"))
        month = int(validated_data.pop("month"))
        year = int(validated_data.pop("year"))
        birthday = datetime.date(year, month, day)

        user = User.objects.create_user(
            username=email_or_phone,
            email=email_or_phone if "@" in email_or_phone else "",
            phone=email_or_phone if "@" not in email_or_phone else "",
            password=password,
            birthday=birthday,
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
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
        token = self.validated_data["token"]
        new_password = self.validated_data["new_password"]
        user = get_user_from_token(token)

        # Establecer nueva contraseña
        user.set_password(new_password)
        user.save()
