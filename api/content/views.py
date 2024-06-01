import re
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Article, StaticPage, Gallery, Video, Image, Category, Section, InfoComponent, FileStorage
from .serializers import (
    ContentBaseSerializer,
    ArticleSerializer,
    StaticPageSerializer,
    GallerySerializer,
    VideoSerializer,
    ImageSerializer,
    CategorySerializer,
    InfoComponentSerializer,
    FileStorageSerializer
    
)


class ContentViewSet(viewsets.ViewSet):
    def _get_serializer_class(self, content_type):
        """Retorna el serializador correspondiente al tipo de contenido."""
        return {
            'content_base': ContentBaseSerializer,
            'article': ArticleSerializer,
            'static_page': StaticPageSerializer,
            'gallery': GallerySerializer,
            'video': VideoSerializer,
            'image': ImageSerializer,
            'category': CategorySerializer,
            'info_component': InfoComponentSerializer,
            'file_storage': FileStorageSerializer
        }.get(content_type)  

    def _get_model(self, content_type):

            if content_type == 'content_base':
                return Section
            elif content_type == 'info_component':
                return InfoComponent
            elif content_type == 'file_storage':
                return FileStorage
            elif content_type == 'article':
                return Article
            elif content_type == 'static_page':
                return StaticPage
            elif content_type == 'gallery':
                return Gallery
            elif content_type == 'video':
                return Video
            elif content_type == 'image':
                return Image
            elif content_type == 'category':
                return Category
            return None

    def _create_parent(self, content_type, id, data):
        model = self._get_model(content_type)
        if model:
            if model.objects.filter(id=id).exists():
               parent = model.objects.get(id=id)
               for attr, value in data.items():
                # Condición para evitar la actualización con archivos vacíos
                if attr in ['main_image', 'thumbnail'] and not value:
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
    def list_content_all(self):
        
        articles = Article.objects.all()
        info_components = InfoComponent.objects.all()
        file_storages = FileStorage.objects.all()
        static_pages = StaticPage.objects.all()
        galleries = Gallery.objects.all()
        videos = Video.objects.all()
        images = Image.objects.all()
        categories = Category.objects.all()
        content_base = Section.objects.all()

        data = {
            'articles': ArticleSerializer(articles, many=True).data,
            'static_pages': StaticPageSerializer(static_pages, many=True).data,
            'galleries': GallerySerializer(galleries, many=True).data,
            'videos': VideoSerializer(videos, many=True).data,
            'images': ImageSerializer(images, many=True).data,
            'categories': CategorySerializer(categories, many=True).data,
            'base':ContentBaseSerializer(content_base, many=True).data,
            'info_components': InfoComponentSerializer(info_components, many=True).data,
            'file_storages': FileStorageSerializer(file_storages, many=True).data
        }
        return Response(data)

    @action(detail=False, methods=['post'])
    def create_content(self, request):
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
                'title': request.data.get('title'),
                'subtitle': request.data.get('subtitle'),
                'content': request.data.get('content'),
                'component': request.data.get('component'),
                'main_image': request.FILES.get('main_image'),
                'thumbnail': request.FILES.get('thumbnail')
            }
            created_parent = self._create_parent(parent_type, id, object_data)
            
        for key, value in creation_data.items():
            match = re.match(r'inputs\[(\d+)\]\[(.*)\]', key)
            if match:
                index, field = match.groups()
                index = int(index)

            content_type = request.data.get(f'inputs[{index}][content_type]')
            serializer_class = self._get_serializer_class(content_type)
            object_data = {
                'title': request.data.get(f'inputs[{index}][title]'),
                'subtitle': request.data.get(f'inputs[{index}][subtitle]'),
                'content': request.data.get(f'inputs[{index}][content]'),
                'icons': request.data.get(f'inputs[{index}][icons]'),
                'tag': request.data.get(f'inputs[{index}][tag]'),
                'title_bullet': request.data.get(f'inputs[{index}][title_bullet]'),
                'content_bullet': request.data.get(f'inputs[{index}][content_bullet]'),
                'component': request.data.get(f'inputs[{index}][component]'),
                'numbers': request.data.get(f'inputs[{index}][numbers]'),
                'author': request.data.get(f'inputs[{index}][author]'),
                'main_image': request.FILES.get(f'inputs[{index}][main_image]'),
                'video': request.FILES.get(f'inputs[{index}][video]'),
                'image': request.FILES.get(f'inputs[{index}][image]'),
                'file': request.FILES.get(f'inputs[{index}][file]'),
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
                'subtitle': request.data.get(f'inputs[{index}][subtitle]'),
                'content': request.data.get(f'inputs[{index}][content]'),
                'icons': request.data.get(f'inputs[{index}][icons]'),
                'tag': request.data.get(f'inputs[{index}][tag]'),
                'title_bullet': request.data.get(f'inputs[{index}][title_bullet]'),
                'content_bullet': request.data.get(f'inputs[{index}][content_bullet]'),
                'component': request.data.get(f'inputs[{index}][component]'),
                'numbers': request.data.get(f'inputs[{index}][numbers]'),
                'author': request.data.get(f'inputs[{index}][author]'),
                'main_image': request.FILES.get(f'inputs[{index}][main_image]'),
                'video': request.FILES.get(f'inputs[{index}][video]'),
                'image': request.FILES.get(f'inputs[{index}][image]'),
                'file': request.FILES.get(f'inputs[{index}][file]'),
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
    def delete_content(self, request):
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
        
    
    