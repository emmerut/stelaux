from rest_framework import serializers
from .models import SimpleContent, DynamicField

class DynamicFieldSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = DynamicField
        fields = '__all__'
        extra_kwargs = {
            'parent': {'required': False},
            'file_image': {'required': False},
            'file_doc': {'required': False},
        }

    def to_internal_value(self, data):
        # Manejar el caso especial de 'file_image' cuando es una cadena
        file_image = data.get('file_image')
        if file_image and isinstance(file_image, str):
            if file_image.startswith('C:\\fakepath\\'):
                data.pop('file_image')
        return super().to_internal_value(data)

class SimpleContentSerializer(serializers.ModelSerializer):
    fields = DynamicFieldSerializer(many=True, required=False)
    
    class Meta:
        model = SimpleContent
        fields = '__all__'
        extra_kwargs = {
            'file_image': {'required': False},
            'file_doc': {'required': False},
        }

    def to_internal_value(self, data):
        # Manejar el caso especial de 'file_image' cuando es una cadena
        file_image = data.get('file_image')
        if file_image and isinstance(file_image, str):
            if file_image.startswith('C:\\fakepath\\'):
                data.pop('file_image')
        return super().to_internal_value(data)

    def create(self, validated_data):
        fields_data = validated_data.pop('fields', [])
        simple_content = SimpleContent.objects.create(**validated_data)
        for field_data in fields_data:
            DynamicField.objects.create(parent=simple_content, **field_data)
        return simple_content

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', [])
        
        # Actualizar los campos de SimpleContent
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar o crear DynamicFields
        existing_ids = set(instance.fields.values_list('id', flat=True))
        for field_data in fields_data:
            field_id = field_data.get('id')
            if field_id:
                if field_id in existing_ids:
                    # Actualizar campo existente
                    field = instance.fields.get(id=field_id)
                    for attr, value in field_data.items():
                        setattr(field, attr, value)
                    field.save()
                    existing_ids.remove(field_id)
                else:
                    # Crear nuevo campo con ID específico
                    DynamicField.objects.create(parent=instance, **field_data)
            else:
                # Crear nuevo campo sin ID
                DynamicField.objects.create(parent=instance, **field_data)

        # Eliminar campos que ya no están en la lista
        instance.fields.filter(id__in=existing_ids).delete()

        return instance