
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from functions import get_user_from_token, prepare_data
from django.shortcuts import get_object_or_404
from .models import SimpleContent, DynamicField
from .serializers import SimpleContentSerializer, DynamicFieldSerializer

class ContentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en SimpleContent.
    """
    queryset = SimpleContent.objects.all()
    serializer_class = SimpleContentSerializer

    @action(detail=False, methods=["get"])
    def get_content(self, request):
        """Obtiene todas las entradas de formularios dinámicos."""
        entries = SimpleContent.objects.all()
        serializer = SimpleContentSerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def create_or_update(self, request):
        """Crea o actualiza una entrada de formulario dinámico."""
        user_token = request.META.get("HTTP_AUTHORIZATION")
        user = get_user_from_token(user_token)
        data = prepare_data(request.data, user)
        parent_data = {key: value for key, value in data.items() if key != 'fields'}

        if parent_data:
            instance_id = parent_data.get('id')
            try:
                instance = SimpleContent.objects.get(id=instance_id) if instance_id else None
                serializer = SimpleContentSerializer(instance, data=parent_data, partial=True)
            except SimpleContent.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)

            if serializer.is_valid():
                parent_instance = serializer.save()
                status_code = status.HTTP_200_OK if instance_id else status.HTTP_201_CREATED
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if data['fields']:
            for field in data['fields']:
                field['parent'] = parent_instance.id  # Asignar el ID del padre
                field_id = field.get('id')
                try:
                    instance = DynamicField.objects.get(id=field_id) if field_id else None
                    serializer = DynamicFieldSerializer(instance, data=field, partial=True)
                except DynamicField.DoesNotExist:
                    return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)

                if serializer.is_valid():
                    serializer.save()
                    status_code = status.HTTP_200_OK if field_id else status.HTTP_201_CREATED
                else:
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status_code)

    @action(detail=False, methods=["delete"])
    def delete_content(self, request):
        print(request.data)
        return Response(status=status.HTTP_204_NO_CONTENT)

