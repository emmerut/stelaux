from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Article, StaticPage, Gallery, Video, Image, Category
from .serializers import (
    ArticleSerializer,
    StaticPageSerializer,
    GallerySerializer,
    VideoSerializer,
    ImageSerializer,
    CategorySerializer
)

class ContentViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['get'])
    def list_all(self, request):
        
        articles = Article.objects.all()
        static_pages = StaticPage.objects.all()
        galleries = Gallery.objects.all()
        videos = Video.objects.all()
        images = Image.objects.all()
        categories = Category.objects.all()

        data = {
            'articles': ArticleSerializer(articles, many=True).data,
            'static_pages': StaticPageSerializer(static_pages, many=True).data,
            'galleries': GallerySerializer(galleries, many=True).data,
            'videos': VideoSerializer(videos, many=True).data,
            'images': ImageSerializer(images, many=True).data,
            'categories': CategorySerializer(categories, many=True).data,
        }
        return Response(data)

    @action(detail=False, methods=['post'])
    def create_content(self, request):
        content_type = request.data.get('content_type')
        serializer = self._get_serializer(content_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def delete_content(self, request):  
        content_type = request.data.get('content_type')
        content_id = request.data.get('id')

        try:
            model = self._get_model(content_type)
            model.objects.get(pk=content_id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)
        

    def _get_serializer(self, content_type, **kwargs):
    
        if content_type == 'article':
            return ArticleSerializer(**kwargs)
        elif content_type == 'static_page':
            return StaticPageSerializer(**kwargs)
        elif content_type == 'gallery':
            return GallerySerializer(**kwargs)
        elif content_type == 'video':
            return VideoSerializer(**kwargs)
        elif content_type == 'image':
            return ImageSerializer(**kwargs)
        elif content_type == 'category':
            return CategorySerializer(**kwargs)
        return None

    def _get_model(self, content_type):
       
        if content_type == 'article':
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