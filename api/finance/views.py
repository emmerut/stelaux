from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from functions import get_user_from_token
from .serializers import FinanceDataSerializer

class FinanceViewSet(viewsets.ModelViewSet):
    
    @action(detail=False, methods=['get'])
    def finance_all_data(self, request):
        user_token=request.META.get('HTTP_AUTHORIZATION')
        user=get_user_from_token(user_token)
        
        data = FinanceDataSerializer(user).data
        return Response(data)