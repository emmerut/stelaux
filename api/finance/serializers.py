from django.db import models
from datetime import timedelta, date
from rest_framework import serializers
from .models import CashBalance, Withdrawals, CustomUser, Customer, Order, BillingItems


class CashBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashBalance
        fields = "__all__"


class WithdrawalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawals
        fields = "__all__"


class FinanceDataSerializer(serializers.Serializer):
    pending_balance = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    available_balance = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    total_withdrawals = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    withdrawals_list = WithdrawalsSerializer(many=True, read_only=True)
    cash_balances_list = CashBalanceSerializer(many=True, read_only=True)

    def get_last_8_cash_balances(self, instance):
        user = instance
        last_8_days = [date.today() - timedelta(days=i) for i in range(8)]
        cash_balances = []

        for day in last_8_days:
            cash_balance_amount = CashBalance.objects.filter(
                user=user, created_at__date=day
            ).aggregate(total=models.Sum("amount"))["total"]
            cash_balances.append(
                cash_balance_amount or 0
            )  # Si no hay operaciones, agrega 0

        return cash_balances

    def get_last_8_withdrawals(self, instance):
        user = instance
        last_8_days = [date.today() - timedelta(days=i) for i in range(8)]
        withdrawals = []

        for day in last_8_days:
            withdrawal_amount = Withdrawals.objects.filter(
                user=user, created_at__date=day
            ).aggregate(total=models.Sum("amount"))["total"]
            withdrawals.append(withdrawal_amount or 0)

        return withdrawals

    def get_last_8_pending_deposits(self, instance):
        user = instance
        last_8_days = [date.today() - timedelta(days=i) for i in range(8)]
        pending_deposits = []

        for day in last_8_days:
            pending_deposit_amount = CashBalance.objects.filter(
                user=user, status="pending", created_at__date=day
            ).aggregate(total=models.Sum("amount"))["total"]
            pending_deposits.append(pending_deposit_amount or 0)

        return pending_deposits

    def to_representation(self, instance):
        user = instance
        data = super().to_representation(instance)
        cash_balance = CashBalance.objects.filter(user=user)
        withdrawals = Withdrawals.objects.filter(user=user)
        pending_deposits = (
            cash_balance.filter(status="pending").aggregate(total=models.Sum("amount"))[
                "total"
            ]
            or 0
        )
        total_withdrawals = (
            withdrawals.aggregate(total=models.Sum("amount"))["total"] or 0
        )
        available_balance = (
            cash_balance.filter(status="available").aggregate(
                total=models.Sum("amount")
            )["total"]
            or 0
        )

        # Asignando valores a la representación
        data["pending_balance"] = pending_deposits
        data["available_balance"] = available_balance
        data["total_withdrawals"] = total_withdrawals
        data["withdrawals_list"] = WithdrawalsSerializer(withdrawals, many=True).data
        data["cash_balances_list"] = CashBalanceSerializer(cash_balance, many=True).data
        data["has_withdrawals"] = withdrawals.exists()

        # Asignando los valores de las últimas 8 operaciones
        data["last_cash_balances"] = self.get_last_8_cash_balances(instance)
        data["last_withdrawals"] = self.get_last_8_withdrawals(instance)
        data["last_pending_deposits"] = self.get_last_8_pending_deposits(instance)

        return data


class CreateClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "fiscal_id", "email", "phone", "address"]


class ProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    qty = serializers.IntegerField()
    discount = serializers.DecimalField(max_digits=10, decimal_places=2)


class ServiceSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    qty = serializers.IntegerField()
    discount = serializers.DecimalField(max_digits=10, decimal_places=2)


class CreateOrderSerializer(serializers.Serializer):
    services = ServiceSerializer(many=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
    discount = serializers.DecimalField(max_digits=10, decimal_places=2)
    tax = serializers.DecimalField(max_digits=10, decimal_places=2)
    total = serializers.DecimalField(max_digits=10, decimal_places=2)


class CreateFullOrderSerializer(serializers.Serializer):
    client_id = serializers.IntegerField(required=False)
    client = CreateClientSerializer()
    products = ProductSerializer(many=True, required=False)
    services = ServiceSerializer(many=True, required=False)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
    discount = serializers.DecimalField(max_digits=10, decimal_places=2)
    tax = serializers.DecimalField(max_digits=10, decimal_places=2)
    total = serializers.DecimalField(max_digits=10, decimal_places=2)

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop("user")
        super().__init__(*args, **kwargs)

    def create(self, validated_data):
        client_data = validated_data["client"]
        if "client_id" in validated_data:
            try:
                client = Customer.objects.get(id=validated_data["client_id"])
                client.name = client_data["name"]
                client.fiscal_id = client_data["fiscal_id"]
                client.email = client_data["email"]
                client.phone = client_data["phone"]
                client.address = client_data["address"]
                client.save()

            except:
                client = Customer.objects.create(
                owner=self.user,
                name=client_data["name"],
                fiscal_id=client_data["fiscal_id"],
                email=client_data["email"],
                phone=client_data["phone"],
                address=client_data["address"],
            ) 
        else:
            client = Customer.objects.create(
                owner=self.user,
                name=client_data["name"],
                fiscal_id=client_data["fiscal_id"],
                email=client_data["email"],
                phone=client_data["phone"],
                address=client_data["address"],
            )

        order = Order(
            customer=client,
            subtotal=validated_data["subtotal"],
            discount=validated_data["discount"],
            tax=validated_data["tax"],
            total=validated_data["total"],
        )
        order.save()

        if "products" in validated_data:
            for product in validated_data["products"]:
                billing_item = BillingItems(
                    order=order,
                    product_id=product["id"],
                    qty=product["qty"],
                    unit_price=product["price"],
                )
                billing_item.save()

        if "services" in validated_data:
            for service in validated_data["services"]:
                billing_item = BillingItems(
                    order=order,
                    service_id=service["id"],
                    qty=service["qty"],
                    unit_price=service["price"],
                )
                billing_item.save()
        return validated_data
