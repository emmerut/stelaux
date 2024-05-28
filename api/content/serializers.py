from rest_framework import serializers
from .models import (
    Article, 
    StaticPage, 
    Gallery, 
    Video, 
    Image, 
    Category,
    InfoComponent,
    FileStorage,
    Section
) 

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class ContentBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class InfoComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoComponent
        fields = '__all__'

class FileStorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileStorage
        fields = '__all__'


class StaticPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = '__all__'


class GallerySerializer(serializers.ModelSerializer):
    images = serializers.PrimaryKeyRelatedField(many=True, queryset=Image.objects.all())

    class Meta:
        model = Gallery
        fields = '__all__'


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
