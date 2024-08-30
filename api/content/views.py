import re
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import SimpleContent, DynamicField
from .serializers import SimpleContentSerializer, DynamicFieldSerializer

class ContentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en SimpleContent.
    """
    queryset = SimpleContent.objects.all()
    serializer_class = SimpleContentSerializer

    def _prepare_data(self, data):
        processed_data = {'fields': [], 'section': data.get('formData[section]', '')}
        
        for key, value in data.items():
            if key.startswith('formData['):
                if '][' not in key:
                    # Campos del formulario principal
                    field_name = key[9:-1]
                    processed_data[field_name] = value
                elif '[file]' not in key:
                    # Campos de items anidados
                    _, index, field_name = key[8:].replace(']', '').split('[', 2)
                    index = int(index)
                    while len(processed_data['fields']) <= index:
                        processed_data['fields'].append({})
                    processed_data['fields'][index][field_name] = value
                elif '[file]' in key:
                    match = re.match(r'formData\[file]\[(\d*)\]?\[([^\]]+)\]$', key)
                    if match:
                        index = int(match.group(1)) if match.group(1) else None
                        field_name = match.group(2)
                        if index is None:
                            processed_data[f'file_{field_name}'] = value
                        else:
                            processed_data['fields'][index][f'file_{field_name}'] = value
        
        return processed_data

    @action(detail=False, methods=["post"])
    def create_or_update(self, request):
        """Crea o actualiza una entrada de formulario dinámico."""
        data = self._prepare_data(request.data)
    
        instance_id = data.get('id')
        if instance_id:
            # Actualizar instancia existente
            try:
                instance = SimpleContent.objects.get(id=instance_id)
                serializer = self.get_serializer(instance, data=data, partial=True)
            except SimpleContent.DoesNotExist:
                return Response({"error": "Instancia no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Crear nueva instancia
            serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK if instance_id else status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["get"])
    def get_content(self, request):
        """Obtiene todas las entradas de formularios dinámicos."""
        entries = SimpleContent.objects.all()
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Obtiene una entrada de formulario dinámico específica."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Elimina una entrada de formulario dinámico específica."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)