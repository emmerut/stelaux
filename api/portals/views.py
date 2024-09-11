# api/portals/views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from functions import prepare_data
from .serializers import (
    TemplateDataSerializer,
    PortalRequirementsSerializer,
    DomainRegistrationSerializer,
    PortalsSerializer,
    CreateTemplateDataSerializer,
    CreatePortalRequirementsSerializer,
    CreateDomainRegistrationSerializer,
    CreatePortalsSerializer
)
from .models import (
    TemplateData,
    PortalRequirements,
    DomainRegistration,
    Portals
)
from functions import get_user_from_token

class PortalRequirementsViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en PortalRequirements.
    """
    queryset = PortalRequirements.objects.all()
    serializer_class = PortalRequirementsSerializer
    
    @action(detail=False, methods=["post"])
    def create_portal_requirements(self, request):
        """Crea o actualiza una entrada requesrimiento."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)

        serializer = CreatePortalRequirementsSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def get_portal_requirements(self, request):
        """
        Obtiene todas las instancias de PortalRequirements.
        """
        entries = PortalRequirements.objects.all()
        serializer = PortalRequirementsSerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["put"])
    def update_portal_requirements(self, request):
        """Crea o actualiza una entrada de portal."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)

        try:
            instance = PortalRequirements.objects.get(id=data['id'])
        except PortalRequirements.DoesNotExist:
            return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PortalRequirementsSerializer(instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["delete"])
    def delete_portal_requirements(self, request):
        """
        Elimina una instancia de PortalRequirements existente.
        """
        user = request.user
        data = request.data

        try:
            instance = PortalRequirements.objects.get(id=data['id'])
        except PortalRequirements.DoesNotExist:
            return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PortalViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en Portal.
    """
    queryset = Portals.objects.all()
    serializer_class = PortalsSerializer

    @action(detail=False, methods=["get"])
    def get_portals(self, request):
        """Obtiene todas las entradas de portales."""
        entries = Portals.objects.all()
        serializer = PortalsSerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def create_or_update_portal(self, request):
        """Crea o actualiza una entrada de portal."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)
        
        if 'id' in data:
            try:
                instance = Portals.objects.get(id=data['id'])
                serializer = CreatePortalsSerializer(instance, data=data, partial=True)
            except Portals.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = CreatePortalsSerializer(data=data)
        
        if serializer.is_valid():
            instance = serializer.save()
            status_code = status.HTTP_200_OK if 'id' in data else status.HTTP_201_CREATED
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if 'template_model' in data:
            template_data = data['template_model']
            try:
                instance = TemplateData.objects.get(id=template_data['id']) if 'id' in template_data else None
                serializer = CreateTemplateDataSerializer(instance, data=template_data, partial=True)
            except TemplateData.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)
            
            if serializer.is_valid():
                serializer.save()
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if 'domain_registration' in data:
            domain_data = data['domain_registration']
            try:
                instance = DomainRegistration.objects.get(id=domain_data['id']) if 'id' in domain_data else None
                serializer = CreateDomainRegistrationSerializer(instance, data=domain_data, partial=True)
            except DomainRegistration.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)
            
            if serializer.is_valid():
                serializer.save()
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status_code)

    @action(detail=False, methods=["delete"])
    def delete_portal(self, request):
        """Elimina una entrada de portal."""
        return Response(status=status.HTTP_204_NO_CONTENT)

class TemplateDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en TemplateData.
    """
    queryset = TemplateData.objects.all()
    serializer_class = TemplateDataSerializer

    @action(detail=False, methods=["get"])
    def get_template_data(self, request):
        """Obtiene todas las entradas de template data."""
        entries = TemplateData.objects.all()
        serializer = TemplateDataSerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def create_template_data(self, request):
        """Crea una nueva entrada de template data."""
        user = request.user
        data = request.data
        prepared_data = prepare_data(data, user)
        serializer = TemplateDataSerializer(data=prepared_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def get_template_data_detail(self, request, pk=None):
        """Obtiene una entrada de template data específica."""
        try:
            entry = TemplateData.objects.get(pk=pk)
            serializer = TemplateDataSerializer(entry)
            return Response(serializer.data)
        except TemplateData.DoesNotExist:
            return Response({"error": "No existe la entrada"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["put"])
    def update_template_data(self, request, pk=None):
        """Actualiza una entrada de template data."""
        try:
            entry = TemplateData.objects.get(pk=pk)
            serializer = TemplateDataSerializer(entry, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TemplateData.DoesNotExist:
            return Response({"error": "No existe la entrada"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["delete"])
    def delete_template_data(self, request, pk=None):
        """Elimina una entrada de template data."""
        try:
            entry = TemplateData.objects.get(pk=pk)
            entry.delete()
            return Response({"message": "Entrada eliminada"})
        except TemplateData.DoesNotExist:
            return Response({"error": "No existe la entrada"}, status=status.HTTP_404_NOT_FOUND)

class DomainViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en DomainRegistration.
    """
    queryset = DomainRegistration.objects.all()
    serializer_class = DomainRegistrationSerializer

    @action(detail=False, methods=["get"])
    def get_domains(self, request):
        """Obtiene todas las entradas de dominios."""
        entries = DomainRegistration.objects.all()
        serializer = DomainRegistrationSerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def create_or_update_domain(self, request):
        """Crea o actualiza una entrada de dominio."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)
        
        if 'id' in data:
            try:
                instance = DomainRegistration.objects.get(id=data['id'])
                serializer = CreateDomainRegistrationSerializer(instance, data=data, partial=True)
            except DomainRegistration.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = CreateDomainRegistrationSerializer(data=data)
        
        if serializer.is_valid():
            instance = serializer.save()
            status_code = status.HTTP_200_OK if 'id' in data else status.HTTP_201_CREATED
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status_code)

    @action(detail=False, methods=["delete"])
    def delete_domain(self, request):
        """Elimina una entrada de dominio."""
        return Response(status=status.HTTP_204_NO_CONTENT)
