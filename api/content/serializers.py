from rest_framework import serializers
from .models import SimpleContent, DynamicField

class DynamicFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicField
        fields = '__all__'

class SimpleContentSerializer(serializers.ModelSerializer):
    fields = DynamicFieldSerializer(many=True, read_only=True)

    class Meta:
        model = SimpleContent
        fields = '__all__'
