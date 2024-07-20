from django.urls import path, include
from rest_framework import routers
from .views import PaymentsViewSet

router = routers.DefaultRouter()
router.register(r'', PaymentsViewSet, basename='Payments')

urlpatterns = [
    path('', include(router.urls)),
]