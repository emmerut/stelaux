from django.urls import path, include
from rest_framework import routers
from .views import FinanceViewSet

router = routers.DefaultRouter()
router.register(r'', FinanceViewSet, basename='Finance')

urlpatterns = [
    path('', include(router.urls)),
]