from rest_framework import viewsets
from rest_framework.decorators import action
from .models import Country, Region, SubRegion, City
from .serializers import CountrySerializer, RegionSerializer
from rest_framework.response import Response
from functions import get_user_from_token

class GeolocationViewSet(viewsets.ModelViewSet):
    
    @action(detail=False, methods=['get'])
    def country_list(self, request):
        user_token = request.META.get('HTTP_AUTHORIZATION')
        user = get_user_from_token(user_token)

        if user:
            countries = Country.objects.all()
            serializer = CountrySerializer(countries, many=True)
            return Response(serializer.data)
        else:
            return Response(status=403, data={"detail": "Invalid token or user not authenticated"})

    @action(detail=False, methods=['get'])
    def region_list(self, request):
        user_token = request.META.get('HTTP_AUTHORIZATION')
        country_code = request.query_params.get('country_code')
        user = get_user_from_token(user_token)

        if user and country_code:
            regions = Region.objects.filter(country__name=country_code)
            serializer = RegionSerializer(regions, many=True)
            return Response(serializer.data)
        else:
            return Response(status=403, data={"detail": "Invalid token, user not authenticated, or country_code not provided"})