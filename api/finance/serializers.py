from django.db import models
from datetime import timedelta, date
from rest_framework import serializers
from .models import CashBalance, Withdrawals, CustomUser

class CashBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashBalance
        fields = '__all__'

class WithdrawalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawals
        fields = '__all__'

class FinanceDataSerializer(serializers.Serializer):
    pending_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    available_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_withdrawals = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    withdrawals_list = WithdrawalsSerializer(many=True, read_only=True)
    cash_balances_list = CashBalanceSerializer(many=True, read_only=True)

    def get_last_8_cash_balances(self, instance):
        user = instance
        last_8_days = [date.today() - timedelta(days=i) for i in range(8)]
        cash_balances = []

        for day in last_8_days:
            cash_balance_amount = CashBalance.objects.filter(user=user, created_at__date=day).aggregate(total=models.Sum('amount'))['total']
            cash_balances.append(cash_balance_amount or 0)  # Si no hay operaciones, agrega 0

        return cash_balances

    def get_last_8_withdrawals(self, instance):
        user = instance
        last_8_days = [date.today() - timedelta(days=i) for i in range(8)]
        withdrawals = []

        for day in last_8_days:
            withdrawal_amount = Withdrawals.objects.filter(user=user, created_at__date=day).aggregate(total=models.Sum('amount'))['total']
            withdrawals.append(withdrawal_amount or 0)

        return withdrawals

    def get_last_8_pending_deposits(self, instance):
        user = instance
        last_8_days = [date.today() - timedelta(days=i) for i in range(8)]
        pending_deposits = []

        for day in last_8_days:
            pending_deposit_amount = CashBalance.objects.filter(user=user, status='pending', created_at__date=day).aggregate(total=models.Sum('amount'))['total']
            pending_deposits.append(pending_deposit_amount or 0)

        return pending_deposits

    def to_representation(self, instance):
        user = instance
        data = super().to_representation(instance)    
        cash_balance = CashBalance.objects.filter(user=user)      
        withdrawals = Withdrawals.objects.filter(user=user)
        pending_deposits = cash_balance.filter(status='pending').aggregate(total=models.Sum('amount'))['total'] or 0
        total_withdrawals = withdrawals.aggregate(total=models.Sum('amount'))['total'] or 0
        available_balance = cash_balance.filter(status='available').aggregate(total=models.Sum('amount'))['total'] or 0

        # Asignando valores a la representación
        data['pending_balance'] = pending_deposits
        data['available_balance'] = available_balance
        data['total_withdrawals'] = total_withdrawals
        data['withdrawals_list'] = WithdrawalsSerializer(withdrawals, many=True).data
        data['cash_balances_list'] = CashBalanceSerializer(cash_balance, many=True).data
        data['has_withdrawals'] = withdrawals.exists() 

        # Asignando los valores de las últimas 8 operaciones
        data['last_cash_balances'] = self.get_last_8_cash_balances(instance)
        data['last_withdrawals'] = self.get_last_8_withdrawals(instance)
        data['last_pending_deposits'] = self.get_last_8_pending_deposits(instance)

        return data