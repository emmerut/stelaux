from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from functions import get_user_from_token
from .serializers import FinanceDataSerializer, CreateFullOrderSerializer, CreateClientSerializer
from .models import Customer

class FinanceViewSet(viewsets.ModelViewSet):

    @action(detail=False, methods=["get"])
    def finance_all_data(self, request):
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)

        data = FinanceDataSerializer(user).data
        return Response(data)
    
    @action(detail=False, methods=["get"])
    def get_customer(self, request):
        customer_id = request.query_params.get('id')
        if customer_id is None:
            user_token = request.META.get("HTTP_AUTHORIZATION")
            user = get_user_from_token(user_token)
            customers = Customer.objects.filter(owner=user)
            if customers.exists():
                serializer = CreateClientSerializer(customers, many=True)
                return Response({"customer": serializer.data})
            else:
                return Response({'error': 'No hay clientes'}, status=status.HTTP_404_NOT_FOUND)
        try:
            customer = Customer.objects.get(id=customer_id)
            serializer = CreateClientSerializer(customer)
            return Response({"customer": serializer.data})
        except Customer.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["post"])
    def create_billing(self, request):
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        serializer = CreateFullOrderSerializer(data=request.data, user=user)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)