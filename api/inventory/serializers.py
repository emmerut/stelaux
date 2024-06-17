from rest_framework import serializers
from .models import (
    Product,
    Category,
    Variant,
    Service,
    ServiceVariant
    
) 

class ProductSerializer(serializers.ModelSerializer):
    total_stock = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_total_stock(self, obj):
        """Obtiene el stock total del producto."""
        return obj.get_total_stock()

    def get_categories(self, obj):
        """Obtiene las categorías del producto."""
        return obj.get_categories()

class VariantSerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField()
    render_color = serializers.SerializerMethodField()
    class Meta:
        model = Variant
        fields = '__all__'
    
    def get_parent(self, obj):
        """Obtiene el nombre del producto padre del variante."""
        return obj.get_parent()
    
    def get_render_color(self, obj):
        """Renderiza el color del variante."""
        return obj.get_color()

#Categories


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

#Services
class ServiceSerializer(serializers.ModelSerializer):
    subcategory_name = serializers.SerializerMethodField()
    class Meta:
        model = Service
        fields = '__all__'
    
    def get_subcategory_name(self, obj):
        return obj.get_subcategory_name()

class ServiceVariantSerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField()
    class Meta:
        model = ServiceVariant
        fields = '__all__'
    
    def get_parent(self, obj):
        return obj.get_parent()