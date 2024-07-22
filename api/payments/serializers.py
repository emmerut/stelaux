from rest_framework import serializers
from .models import PaymentIntent, PaymentMethods
from decimal import Decimal

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethods
        fields = ['id', 'method_type', 'provider', 'token', 'last_4_digits', 'expiry_date', 'is_default']

class PaymentIntentSerializer(serializers.ModelSerializer):
    tax_amount = serializers.SerializerMethodField()
    fee_amount = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    payment_method = PaymentMethodSerializer(read_only=True)  # Add this line

    class Meta:
        model = PaymentIntent
        fields = ['id', 'status', 'transaction_type', 'user', 'product_name', 'client_secret', 'amount', 'currency', 'annually', 'created_at', 'updated_at', 'tax_amount', 'fee_amount', 'total_amount', 'payment_method']  # Add 'payment_method' to the fields

    def get_tax_amount(self, obj):
        if obj.currency == 'usd':
            return (obj.amount * Decimal(0.10)).quantize(Decimal('0.00'))  # Round to 2 decimal places
        return 0

    def get_fee_amount(self, obj):
        if obj.currency == 'usd':
            return (obj.amount * Decimal(0.04)).quantize(Decimal('0.00'))  # Round to 2 decimal places
        return 0

    def get_total_amount(self, obj):
        """Calculates the total amount including tax and fees."""
        return (obj.amount + self.get_tax_amount(obj) + self.get_fee_amount(obj)).quantize(Decimal('0.00'))  # Round to 2 decimal places
