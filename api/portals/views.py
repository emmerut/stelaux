# api/portals/views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from functions import prepare_data
from .serializers import (
    TemplateDataSerializer,
    PortalsSerializer,
    PortalRequirementsSerializer,
    DomainRegistrationSerializer,
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
    def create_or_update(self, request):
        """Crea o actualiza una entrada requerimiento."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)

        instance_id = data.get('id')

        if instance_id:
            try:
                instance = PortalRequirements.objects.get(id=data['id'])
                serializer = CreatePortalRequirementsSerializer(instance, data=data, partial=True)
            except PortalRequirements.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = CreatePortalRequirementsSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save(user=user)
            try:
                require_data = Portals.objects.get(requirement_data_id=instance_id)
                require_data.requirement_data = serializer.instance
                require_data.save()
            except:
                Portals.objects.create(
                    user=user, 
                    current_step=1,
                    requirement_data=serializer.instance
                )
            status_code = status.HTTP_200_OK if 'id' in data else status.HTTP_201_CREATED
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.data, status=status_code)

    @action(detail=False, methods=["get"])
    def get_portal_data(self, request):
        """
        Obtiene todas las instancias de PortalRequirements.
        """
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        entries = PortalRequirements.objects.filter(user=user)
        serializer = PortalRequirementsSerializer(entries, many=True)
        return Response(serializer.data)

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

class TemplateDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en TemplateData.
    """
    queryset = TemplateData.objects.all()
    serializer_class = TemplateDataSerializer

    @action(detail=False, methods=["get"])
    def get_template_data(self, request):
        """Obtiene todas las entradas de template data."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        portal_id = request.GET.get('portal_id')
        if portal_id:
            entries = TemplateData.objects.filter(user=user, portals__id=portal_id)
        else:
            entries = TemplateData.objects.filter(user=user)
        serializer = TemplateDataSerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def create_or_update(self, request):
        """Crea o actualiza una entrada de template data."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)
        
        instance_id = data.get('id')

        if instance_id:
            try:
                instance = TemplateData.objects.get(id=data['id'])
                serializer = CreateTemplateDataSerializer(instance, data=data, partial=True)
            except TemplateData.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = CreateTemplateDataSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            status_code = status.HTTP_200_OK if 'id' in data else status.HTTP_201_CREATED
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.data, status=status_code)

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
    def create_or_update(self, request):
        """Crea o actualiza una entrada de dominio."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)
        
        instance_id = data.get('id')

        if instance_id:
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

class PortalsViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en Portals.
    """
    queryset = Portals.objects.all()

    @action(detail=False, methods=["get"])
    def get_portal_data(self, request):
        """
        Obtiene todas las instancias de Portals.
        """
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        entries = Portals.objects.filter(user=user)
        serializer = PortalsSerializer(entries, many=True, context={'user_id': user.id})
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def create_or_update(self, request):
        """
        Crea o actualiza una instancia de Portals.
        """
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)
        
        instance_id = data.get('id')

        if instance_id:
            try:
                instance = Portals.objects.get(id=data['id'])
                serializer = CreatePortalsSerializer(instance, data=data, partial=True)
            except Portals.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = CreatePortalsSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save(user=user)
            status_code = status.HTTP_200_OK if 'id' in data else status.HTTP_201_CREATED
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.data, status=status_code)

    @action(detail=False, methods=["delete"])
    def delete_portal(self, request):
        """
        Elimina una instancia de Portals.
        """
        pk=request.data.get('portal_id')
    
        try:
            entry = Portals.objects.get(pk=pk)
            entry.delete()
            entry.requirement_data.delete()
            return Response({"message": "Entrada eliminada"})
        except Portals.DoesNotExist:
            return Response({"error": "No existe la entrada"}, status=status.HTTP_404_NOT_FOUND)
