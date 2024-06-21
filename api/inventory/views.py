import re, json
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, Variant, Category, SubCategory, SubCategories, BaseCategories, Service, ServiceVariant
from .serializers import (
    ProductSerializer,
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
            'product_variant': VariantSerializer,
            'category': CategorySerializer,
            'service': ServiceSerializer,
            'service_variant': ServiceVariantSerializer
        }.get(product_type)  

    def _get_model(self, product_type):

            if product_type == 'product':
                return Product
            elif product_type == 'variant':
                return Variant
            elif product_type == 'category':
                return Category
            elif product_type == 'service':
                return Service
            elif product_type == 'service_variant':
                return ServiceVariant
            return None

    def _create_category(self, parent_type, data):
        if parent_type == 'product':

            # Crea o actualiza la categoría principal
            category_data = {
                'name': data.get('category'),
                'slug': data.get('category').replace(' ', '-').lower(),  # Crea un slug a partir del nombre
            }
            try:
                category = Category.objects.get(slug=category_data['slug'])
                # Si la categoría existe, actualiza los datos
                category.name = category_data['name']
                category.save()
            except Category.DoesNotExist:
                # Si la categoría no existe, crea una nueva
                category = Category.objects.create(**category_data)

            # Crea o actualiza la subcategoría
            subcategory_data = {
                'parent': category,
                'name': data.get('subcategory'),
                'slug': data.get('subcategory').replace(' ', '-').lower(),
            }
            try:
                subcategory = SubCategory.objects.get(parent=category, slug=subcategory_data['slug'])
                # Si la subcategoría existe, actualiza los datos
                subcategory.name = subcategory_data['name']
                subcategory.save()
            except SubCategory.DoesNotExist:
                # Si la subcategoría no existe, crea una nueva
                subcategory = SubCategory.objects.create(**subcategory_data)

            # Crea o actualiza la subcategoría de nivel 2
            subcategories_data = {
                'parent': subcategory,
                'name': data.get('subcategory2'),
                'slug': data.get('subcategory2').replace(' ', '-').lower(),
            }
            try:
                subcategories = SubCategories.objects.get(parent=subcategory, slug=subcategories_data['slug'])
                # Si la subcategoría existe, actualiza los datos
                subcategories.name = subcategories_data['name']
                subcategories.save()
            except SubCategories.DoesNotExist:
                # Si la subcategoría no existe, crea una nueva
                subcategories = SubCategories.objects.create(**subcategories_data)

            # Crea o actualiza la subcategoría de nivel 3
            basecategories_data = {
                'parent': subcategories,
                'name': data.get('subcategory3'),
                'slug': data.get('subcategory3').replace(' ', '-').lower(),
            }
            try:
                basecategories = BaseCategories.objects.get(parent=subcategories, slug=basecategories_data['slug'])
                # Si la subcategoría existe, actualiza los datos
                basecategories.name = basecategories_data['name']
                basecategories.save()
            except BaseCategories.DoesNotExist:
                # Si la subcategoría no existe, crea una nueva
                basecategories = BaseCategories.objects.create(**basecategories_data)

            return basecategories
        
        elif parent_type == 'service':
            category_data = {
                'name': data.get('category'),
                'slug': data.get('category').replace(' ', '-').lower(),  # Crea un slug a partir del nombre
            }
            try:
                category = Category.objects.get(slug=category_data['slug'])
                # Si la categoría existe, actualiza los datos
                category.name = category_data['name']
                category.save()
            except Category.DoesNotExist:
                # Si la categoría no existe, crea una nueva
                category = Category.objects.create(**category_data)

            return category
        
        return None

    def _create_parent(self, parent_type, id, object_data):
        if parent_type == 'product':
    
            if id is None:
                serializer = ProductSerializer(data=object_data)
                if serializer.is_valid():
                    parent_object = serializer.save()
                    return parent_object
                else:
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    parent_object = Product.objects.get(pk=id)
                    serializer = ProductSerializer(parent_object, data=object_data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return parent_object
                    else:

                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except Product.DoesNotExist:
                    return Response({'error': f'No se encontró el objeto Product con ID {id}'},
                                    status=status.HTTP_404_NOT_FOUND)
                
        elif parent_type == 'service':
            if id is None:
                serializer = ServiceSerializer(data=object_data)
                if serializer.is_valid():
                    parent_object = serializer.save()
                    return parent_object
                else:
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    parent_object = Service.objects.get(pk=id)
                    serializer = ServiceSerializer(parent_object, data=object_data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return parent_object
                    else:
                        print(serializer.errors)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except Service.DoesNotExist:
                    return Response({'error': f'No se encontró el objeto Service con ID {id}'},
                                    status=status.HTTP_404_NOT_FOUND)
        
        elif parent_type == 'variant_service':
            if id is None:
                serializer = ServiceVariantSerializer(data=object_data)
                if serializer.is_valid():
                    parent_object = serializer.save()
                    return parent_object
                else:
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    parent_object = ServiceVariant.objects.get(pk=id)
                    serializer = ServiceVariantSerializer(parent_object, data=object_data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return parent_object
                    else:
                        print(serializer.errors)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except Service.DoesNotExist:
                    return Response({'error': f'No se encontró el objeto Service con ID {id}'},
                                    status=status.HTTP_404_NOT_FOUND)
        
        elif parent_type == 'product_variant':
            if id is None:
                serializer = VariantSerializer(data=object_data)
                if serializer.is_valid():
                    parent_object = serializer.save()
                    return parent_object
                else:
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    parent_object = Variant.objects.get(pk=id)
                    serializer = VariantSerializer(parent_object, data=object_data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return parent_object
                    else:
                        print(serializer.errors)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except Service.DoesNotExist:
                    return Response({'error': f'No se encontró el objeto Service con ID {id}'},
                                    status=status.HTTP_404_NOT_FOUND)
        
        else:
            return Response({'error': 'Tipo de objeto padre no válido'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'])
    def list_product_all(self, request):
        products = Product.objects.all()
        variants = Variant.objects.all()
        
        data = {
            'products': ProductSerializer(products, many=True).data,
            'variants': VariantSerializer(variants, many=True).data,
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def list_service_all(self, request):
        services = Service.objects.all()
        variants = ServiceVariant.objects.all()

        data = {
            'services': ServiceSerializer(services, many=True).data,
            'variants': ServiceVariantSerializer(variants, many=True).data,
        }
        return Response(data)

    @action(detail=False, methods=['post'])
    def create_product(self, request):
        created_objects = []
        updated_objects = []
        created_parent = None

        creation_indexes = set()
        creation_data = {}
        update_data = {}

        for key, value in request.data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                try:
                    id_value = int(value)
                except (ValueError, TypeError):
                    id_value = None

                if field == 'id':
                    if id_value is None:
                        creation_indexes.add(int(index))
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
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'status': request.data.get('status'),
                'color': request.data.get('color'),
                'size': request.data.get('size'),
                'stock': request.data.get('stock'),
                'price': request.data.get('price'),
            }

            image = request.FILES.get('image')
            if image:
                object_data['image'] = image

            created_parent = self._create_parent(parent_type, id, object_data)

        # Obtén la basecategory creada
        basecategories = self._create_category(parent_type, request.data)

        # Guarda la basecategory en el objeto Product
        if created_parent:
            created_parent.category = basecategories
            created_parent.save()

        # Crear los objetos ProductVariant
        for key, value in creation_data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                index = int(index)

            content_type = request.data.get(f'inputs[{index}][content_type]')
            serializer_class = self._get_serializer_class(content_type)
            object_data = {
                'status': request.data.get(f'inputs[{index}][status]'),
                'color': request.data.get(f'inputs[{index}][color]'),
                'size': request.data.get(f'inputs[{index}][size]'),
                'price': request.data.get(f'inputs[{index}][price]'),
                'stock': request.data.get(f'inputs[{index}][stock]'),
            }
            image = request.FILES.get(f'inputs[{index}][image]')
            if image:
                object_data['image'] = image
                
            serializer = serializer_class(data=object_data)
            if serializer.is_valid():
                if created_parent:
                    created_object = serializer.save(product=created_parent)
                    created_objects.append((created_object, serializer_class))
                else:
                    created_object = serializer.save()
                    created_objects.append((created_object, serializer_class))
            else:  
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar los objetos ProductVariant existentes
        for key, object_id in update_data.items():
            try:
                index = int(key.split('[')[1].split(']')[0])
                content_type = request.data.get(f'inputs[{index}][content_type]')
                serializer_class = self._get_serializer_class(content_type)

                if not serializer_class:
                    return Response({'error': 'Tipo de contenido no válido'}, status=status.HTTP_400_BAD_REQUEST)

                object_data = {
                'status': request.data.get(f'inputs[{index}][status]'),
                'color': request.data.get(f'inputs[{index}][color]'),
                'size': request.data.get(f'inputs[{index}][size]'),
                'price': request.data.get(f'inputs[{index}][price]'),
                'stock': request.data.get(f'inputs[{index}][stock]'),
                }
                image = request.FILES.get(f'inputs[{index}][image]')
                if image:
                    object_data['image'] = image

                try:
                    instance = serializer_class.Meta.model.objects.get(pk=object_id)
                    serializer = serializer_class(instance, data=object_data, partial=True)
                    if serializer.is_valid():
                        updated_object = serializer.save()
                        updated_objects.append((updated_object, serializer_class))
                    else:
                        print(serializer.errors)
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
    def delete_batch(self, request):
        try:
            data = json.loads(request.body)

            product_ids = [item['id'] for item in data if item['isProduct'] is True]
            service_ids = [item['id'] for item in data if item['isService'] is True]
            product_variant_ids = [item['id'] for item in data if item['isProductVariant'] is True]
            service_variant_ids = [item['id'] for item in data if item['isServiceVariant'] is True]

            if product_ids:
                Product.objects.filter(id__in=product_ids).delete()
            if service_ids:
                Service.objects.filter(id__in=service_ids).delete()
            if product_variant_ids:
                Variant.objects.filter(id__in=product_variant_ids).delete()
            if service_variant_ids:
                ServiceVariant.objects.filter(id__in= service_variant_ids).delete()

            return Response({'message': 'Items processed successfully'}, status=status.HTTP_204_NO_CONTENT)
        
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON data'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def create_service(self, request):
        created_objects = []
        updated_objects = []
        created_parent = None

        creation_indexes = set()
        creation_data = {}
        update_data = {}

        for key, value in request.data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                try:
                    id_value = int(value)
                except (ValueError, TypeError):
                    id_value = None

                if field == 'id':
                    if id_value is None:
                        creation_indexes.add(int(index))
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
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'status': request.data.get('status'),
                'price': request.data.get('price'),
            }

            image = request.FILES.get('image')
            if image:
                object_data['image'] = image

            created_parent = self._create_parent(parent_type, id, object_data)

        # Obtén la basecategory creada
        category = self._create_category(parent_type, request.data)

        # Guarda la basecategory en el objeto Service
        if created_parent:
            created_parent.subcategory = category
            created_parent.save()

        # Crear los objetos ServiceVariant
        for key, value in creation_data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                index = int(index)

            content_type = request.data.get(f'inputs[{index}][content_type]')
            serializer_class = self._get_serializer_class(content_type)
            object_data = {
                'status': request.data.get(f'inputs[{index}][status]'),
                'title': request.data.get(f'inputs[{index}][title]'),
                'description': request.data.get(f'inputs[{index}][description]'),
                'price': request.data.get(f'inputs[{index}][price]'),
            }
            image = request.FILES.get(f'inputs[{index}][image]')
            if image:
                object_data['image'] = image

            serializer = serializer_class(data=object_data)
            if serializer.is_valid():
                if created_parent:
                    created_object = serializer.save(service=created_parent)
                    created_objects.append((created_object, serializer_class))
                else:
                    created_object = serializer.save()
                    created_objects.append((created_object, serializer_class))
            else:  
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar los objetos ServiceVariant existentes
        for key, object_id in update_data.items():
            
            try:
                index = int(key.split('[')[1].split(']')[0])
                content_type = request.data.get(f'inputs[{index}][content_type]')
                serializer_class = self._get_serializer_class(content_type)
                if not serializer_class:
                    print(f"Tipo de contenido no válido: {content_type}")
                    return Response({'error': 'Tipo de contenido no válido'}, status=status.HTTP_400_BAD_REQUEST)

                object_data = {
                'status': request.data.get(f'inputs[{index}][status]'),
                'title': request.data.get(f'inputs[{index}][title]'),
                'description': request.data.get(f'inputs[{index}][description]'),
                'price': request.data.get(f'inputs[{index}][price]'),
                }
                image = request.FILES.get(f'inputs[{index}][image]')
                if image:
                    object_data['image'] = image
                try:
                    instance = serializer_class.Meta.model.objects.get(pk=object_id)
                    serializer = serializer_class(instance, data=object_data, partial=True)
                    if serializer.is_valid():
                        updated_object = serializer.save()
                        updated_objects.append((updated_object, serializer_class))
                    else:
                        print(serializer.errors)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except serializer_class.Meta.model.DoesNotExist:
                    return Response({'error': f'No se encontró el objeto con ID {object_id}'},
                                    status=status.HTTP_404_NOT_FOUND)

            except (ValueError, IndexError) as e:
                print(e)
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
        
    