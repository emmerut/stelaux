from django.urls import path, include
from rest_framework import routers
from .views import PortalViewSet, PortalRequirementsViewSet, DomainViewSet, TemplateDataViewSet

router = routers.DefaultRouter()
router.register(r'', PortalViewSet, basename='portal')
router.register(r'requirements/', PortalRequirementsViewSet, basename='portal_requirements')
router.register(r'domains/', DomainViewSet, basename='domains')
router.register(r'templates/', TemplateDataViewSet, basename='templates')

urlpatterns = [
    path('', include(router.urls)),
]
