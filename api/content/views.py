import re
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import SimpleContent
from .serializers import DynamicFormEntrySerializer
from rest_framework.decorators import action

class ContentViewSet(viewsets.ModelViewSet):
    """
    Vista para manejar entradas de formularios dinámicos.
    """
    queryset = SimpleContent.objects.all()
    serializer_class = DynamicFormEntrySerializer

    def _prepare_data(self, data):
        processed_data = {'fields': [], 'section': data.get('formData[section]') }
        for key, value in data.items():
            if key.startswith('formData[') and key.endswith(']') and '][' not in key:
                # Campos del formulario principal
                field_name = key[9:-1]
                processed_data[field_name] = value
                
            elif key.startswith('formData[') and '[file]' not in key and '][' in key and key[8] != ']': 
                # Campos de items anidados
                _, index, field_name = key[8:].replace(']', '').split('[', 2)
                index = int(index)
                while len(processed_data['fields']) <= index:
                    processed_data['fields'].append({})
                processed_data['fields'][index][field_name] = value
            
            elif re.match(r'formData\[file]\[([^\]]+)\]$', key): 
                field_name = key[15:-1]
                if field_name == 'image':  
                    processed_data['file_image'] = value
                elif field_name == 'doc':  
                    processed_data['file_doc'] = value

            elif re.match(r'formData\[file]\[(\d+)\]\[([^\]]+)\]$', key): 
                # Campos de items anidados
                match = re.match(r'formData\[file]\[(\d+)\]\[([^\]]+)\]$', key)
                index = int(match.group(1))
                field_name = match.group(2)
                if field_name == 'image':
                    processed_data['fields'][index]['file_image'] = value
                elif field_name == 'doc':
                    processed_data['fields'][index]['file_doc'] = value
        return processed_data

    @action(detail=False, methods=["post"])
    def create_content(self, request):
        """Crea una nueva entrada de formulario dinámico."""
        # Prepara los datos del formulario
        data = self._prepare_data(request.data)
        # Crea la entrada de formulario dinámico
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def get_content(self):
        """Obtiene todas las entradas de formularios dinámicos."""
        entries = SimpleContent.objects.all()
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["delete"])
    def delete(self, pk=None):
        """Elimina una entrada de formulario dinámico específica."""
        try:
            entry = SimpleContent.objects.get(pk=pk)
        except SimpleContent.DoesNotExist:
            return Response({'detail': 'Entrada no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
