from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GeolocationViewSet


router = DefaultRouter()
router.register(r'', GeolocationViewSet, basename='geolocation')

urlpatterns = [
    path('', include(router.urls)),
]