from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet

router = routers.DefaultRouter()
router.register(r'', UserViewSet, basename='User')

urlpatterns = [
    path('', include(router.urls)),
]