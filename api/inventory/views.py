import re
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, ProductCatalog, Variant, Category, Service, ServiceVariant
from .serializers import (
    ProductSerializer,
    CatalogSerializer,
    VariantSerializer,
    CategorySerializer,
    ServiceSerializer,
    ServiceVariantSerializer
)


class InventoryViewSet(viewsets.ViewSet):
    def _get_serializer_class(self, product_type):
        """Retorna el serializador correspondiente al tipo de contenido."""
        return {
            'product': ProductSerializer,
            'variant': VariantSerializer,
            'catalog': CatalogSerializer,
            'category': CategorySerializer,
            'service': ServiceSerializer,
            'service_variant': ServiceVariantSerializer
        }.get(product_type)  

    def _get_model(self, product_type):

            if product_type == 'product':
                return Product
            elif product_type == 'variant':
                return Variant
            elif product_type == 'catalog':
                return ProductCatalog
            elif product_type == 'category':
                return Category
            elif product_type == 'service':
                return Service
            elif product_type == 'service_variant':
                return ServiceVariant
            return None

    def _create_parent(self, product_type, id, data):
        model = self._get_model(product_type)
        if model:
            if model.objects.filter(id=id).exists():
               parent = model.objects.get(id=id)
               for attr, value in data.items():
                # Condición para evitar la actualización con archivos vacíos
                if attr in ['image'] and not value:
                    continue
                setattr(parent, attr, value)
                parent.save()
                print('parent updated')
            else:
                parent = model.objects.create(**data)
                print('parent created')
            return parent.pk
        return None

    @action(detail=False, methods=['get'])
    def list_product_all(self):
        
        products = Product.objects.all()
        variants = Variant.objects.all()
        catalog = ProductCatalog.objects.all()
        categories = Category.objects.all()

        data = {
            'products': ProductSerializer(products, many=True).data,
            'variants': VariantSerializer(variants, many=True).data,
            'catalog': CatalogSerializer(catalog, many=True).data,
            'categories': CategorySerializer(categories, many=True).data,
        }
        return Response(data)

    @action(detail=False, methods=['post'])
    def create_product(self, request):
        created_objects = []        
        updated_objects = []    
        created_parent = None
       
        creation_indexes = set()
        # Dividir los datos de entrada por objetos a crear y objetos a actualizar
        creation_data = {}
        update_data = {}
        
        for key, value in request.data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                # Intentar convertir el valor del campo 'id' a un entero:
                try:
                    id_value = int(value)
                except (ValueError, TypeError):
                    id_value = None

                if field == 'id':
                    if id_value is None:
                        creation_indexes.add(int(index))  # Agregar índice a crear
                        creation_data[key] = value
                    else:
                        if int(index) not in creation_indexes: 
                            update_data[key] = value

        if request.data.get('parent_type'):
            parent_type = request.data.get('parent_type')
            id = request.data.get('parent_id')
            if id == 'undefined' or id == '':
                id = None
            
            object_data = {
                'name': request.data.get('name'),
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'component': request.data.get('component'),
                'image': request.FILES.get('image'),
            }
            created_parent = self._create_parent(parent_type, id, object_data)
            
        for key, value in creation_data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                index = int(index)

            content_type = request.data.get(f'inputs[{index}][product_type]')
            serializer_class = self._get_serializer_class(content_type)
            object_data = {
                'title': request.data.get(f'inputs[{index}][title]'),
                'description': request.data.get(f'inputs[{index}][description]'),
                'color': request.data.get(f'inputs[{index}][color]'),
                'size': request.data.get(f'inputs[{index}][size]'),
                'price': request.data.get(f'inputs[{index}][price]'),
                'quantity': request.data.get(f'inputs[{index}][quantity]'),
                'sku': request.data.get(f'inputs[{index}][sku]'),
                'name': request.data.get(f'inputs[{index}][name]'),
                'section_type': request.data.get(f'inputs[{index}][section_type]'),
                'content': request.data.get(f'inputs[{index}][content]'),
                'order': request.data.get(f'inputs[{index}][order]'),
                'image': request.FILES.get(f'inputs[{index}][image]'),   
            }
            serializer = serializer_class(data=object_data)
            if serializer.is_valid():
                if created_parent:
                    created_object = serializer.save(parent_id=created_parent)
                    created_objects.append((created_object, serializer_class))
                else:
                    created_object = serializer.save()
                    created_objects.append((created_object, serializer_class))
            else:  
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        for key, object_id in update_data.items():
            try:
                index = int(key.split('[')[1].split(']')[0])
                content_type = request.data.get(f'inputs[{index}][content_type]')
                serializer_class = self._get_serializer_class(content_type)

                if not serializer_class:
                    return Response({'error': 'Tipo de contenido no válido'}, status=status.HTTP_400_BAD_REQUEST)

                object_data = {
                'title': request.data.get(f'inputs[{index}][title]'),
                'description': request.data.get(f'inputs[{index}][description]'),
                'color': request.data.get(f'inputs[{index}][color]'),
                'size': request.data.get(f'inputs[{index}][size]'),
                'price': request.data.get(f'inputs[{index}][price]'),
                'quantity': request.data.get(f'inputs[{index}][quantity]'),
                'sku': request.data.get(f'inputs[{index}][sku]'),
                'name': request.data.get(f'inputs[{index}][name]'),
                'section_type': request.data.get(f'inputs[{index}][section_type]'),
                'content': request.data.get(f'inputs[{index}][content]'),
                'order': request.data.get(f'inputs[{index}][order]'),
                'image': request.FILES.get(f'inputs[{index}][image]'),   
            }
                try:
                    instance = serializer_class.Meta.model.objects.get(pk=object_id)
                    serializer = serializer_class(instance, data=object_data, partial=True)
                    if serializer.is_valid():
                        updated_object = serializer.save()
                        updated_objects.append((updated_object, serializer_class))
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except serializer_class.Meta.model.DoesNotExist:
                    return Response({'error': f'No se encontró el objeto con ID {object_id}'},
                                    status=status.HTTP_404_NOT_FOUND)

            except (ValueError, IndexError) as e:
                return Response({'error': f'Formato de datos incorrecto: {e}'}, status=status.HTTP_400_BAD_REQUEST)
            
        response_data = {}
        

        if created_objects:
            response_data['created'] = [serializer(obj).data for obj, serializer in created_objects]
        if updated_objects:
            response_data['updated'] = [serializer(obj).data for obj, serializer in updated_objects]

        if response_data:
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'No se crearon ni actualizaron objetos.'}, status=status.HTTP_200_OK)
            
    @action(detail=False, methods=['delete'])
    def delete_product(self, request):
        parent_id = request.data.get('parent_id')
        parent_type = request.data.get('parent_type')
        content_type = request.data.get('type')
        content_id = request.data.get('id')

        serializer_class = self._get_serializer_class(content_type)
        if not serializer_class:
            return Response({'error': 'Tipo de contenido no válido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            model = self._get_model(content_type)
            model.objects.get(pk=content_id).delete()

            if parent_id:
                parent_model = self._get_model(parent_type)
                parent_instance = model.objects.filter(parent_id=parent_id).count()
                if parent_instance == 0:
                    parent_model.objects.get(pk=parent_id).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['post'])
    def create_service(self, request):
        created_objects = []        
        updated_objects = []    
        created_parent = None
       
        creation_indexes = set()
        # Dividir los datos de entrada por objetos a crear y objetos a actualizar
        creation_data = {}
        update_data = {}
        
        for key, value in request.data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                # Intentar convertir el valor del campo 'id' a un entero:
                try:
                    id_value = int(value)
                except (ValueError, TypeError):
                    id_value = None

                if field == 'id':
                    if id_value is None:
                        creation_indexes.add(int(index))  # Agregar índice a crear
                        creation_data[key] = value
                    else:
                        if int(index) not in creation_indexes: 
                            update_data[key] = value

        if request.data.get('parent_type'):
            parent_type = request.data.get('parent_type')
            id = request.data.get('parent_id')
            if id == 'undefined' or id == '':
                id = None
            
            object_data = {
                'name': request.data.get('name'),
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'image': request.FILES.get('image'),
            }
            created_parent = self._create_parent(parent_type, id, object_data)
            
        for key, value in creation_data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                index = int(index)

            content_type = request.data.get(f'inputs[{index}][product_type]')
            serializer_class = self._get_serializer_class(content_type)
            object_data = {
                'service': request.data.get(f'inputs[{index}][parent]'),
                'description': request.data.get(f'inputs[{index}][description]'),
                'duration': request.data.get(f'inputs[{index}][duration]'),
                'price': request.data.get(f'inputs[{index}][price]'),   
            }
            serializer = serializer_class(data=object_data)
            if serializer.is_valid():
                if created_parent:
                    created_object = serializer.save(parent_id=created_parent)
                    created_objects.append((created_object, serializer_class))
                else:
                    created_object = serializer.save()
                    created_objects.append((created_object, serializer_class))
            else:  
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        for key, object_id in update_data.items():
            try:
                index = int(key.split('[')[1].split(']')[0])
                content_type = request.data.get(f'inputs[{index}][content_type]')
                serializer_class = self._get_serializer_class(content_type)

                if not serializer_class:
                    return Response({'error': 'Tipo de contenido no válido'}, status=status.HTTP_400_BAD_REQUEST)

                object_data = {
                    'service': request.data.get(f'inputs[{index}][parent]'),
                    'description': request.data.get(f'inputs[{index}][description]'),
                    'duration': request.data.get(f'inputs[{index}][duration]'),
                    'price': request.data.get(f'inputs[{index}][price]'),   
                }
                try:
                    instance = serializer_class.Meta.model.objects.get(pk=object_id)
                    serializer = serializer_class(instance, data=object_data, partial=True)
                    if serializer.is_valid():
                        updated_object = serializer.save()
                        updated_objects.append((updated_object, serializer_class))
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except serializer_class.Meta.model.DoesNotExist:
                    return Response({'error': f'No se encontró el objeto con ID {object_id}'},
                                    status=status.HTTP_404_NOT_FOUND)

            except (ValueError, IndexError) as e:
                return Response({'error': f'Formato de datos incorrecto: {e}'}, status=status.HTTP_400_BAD_REQUEST)
            
        response_data = {}
        

        if created_objects:
            response_data['created'] = [serializer(obj).data for obj, serializer in created_objects]
        if updated_objects:
            response_data['updated'] = [serializer(obj).data for obj, serializer in updated_objects]

        if response_data:
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'No se crearon ni actualizaron objetos.'}, status=status.HTTP_200_OK)
            
    @action(detail=False, methods=['delete'])
    def delete_service(self, request):
        parent_id = request.data.get('parent_id')
        parent_type = request.data.get('parent_type')
        content_type = request.data.get('type')
        content_id = request.data.get('id')

        serializer_class = self._get_serializer_class(content_type)
        if not serializer_class:
            return Response({'error': 'Tipo de contenido no válido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            model = self._get_model(content_type)
            model.objects.get(pk=content_id).delete()

            if parent_id:
                parent_model = self._get_model(parent_type)
                parent_instance = model.objects.filter(parent_id=parent_id).count()
                if parent_instance == 0:
                    parent_model.objects.get(pk=parent_id).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)
        
    