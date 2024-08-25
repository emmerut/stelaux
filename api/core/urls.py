from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

...

schema_view = get_schema_view(
   openapi.Info(
      title="StelaUX Control Dynamic API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('v1/auth/', include('users.urls')),
    path('v1/stela-editor/', include('content.urls')),
    path('v1/inventory/', include('inventory.urls')),
    path('v1/finance/', include('finance.urls')),
    path('v1/users/', include('users.urls')),
    path('v1/payments/', include('payments.urls')),
    path('v1/geolocation/', include('geolocation.urls')),
    path('v1/docs', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
