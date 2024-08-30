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
        file_image = data.get('file_image')
        if file_image and isinstance(file_image, str):
            if file_image.startswith('C:\\fakepath\\'):
                data.pop('file_image')
        
        file_doc = data.get('file_doc')
        if file_doc and isinstance(file_doc, str):
            if file_doc.startswith('C:\\fakepath\\'):
                data.pop('file_doc')
        
        return super().to_internal_value(data)

    def create(self, validated_data):
        fields_data = validated_data.pop('fields', [])
        simple_content = SimpleContent.objects.create(**validated_data)
        for field_data in fields_data:
            DynamicField.objects.create(parent=simple_content, **field_data)
        return simple_content

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', [])
        
        # Update SimpleContent fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or create DynamicFields
        existing_ids = set(instance.fields.values_list('id', flat=True))
        for field_data in fields_data:
            field_id = field_data.get('id')
            if field_id:
                if field_id in existing_ids:
                    field = instance.fields.get(id=field_id)
                    for attr, value in field_data.items():
                        setattr(field, attr, value)
                    field.save()
                    existing_ids.remove(field_id)
                else:
                    DynamicField.objects.create(parent=instance, **field_data)
            else:
                DynamicField.objects.create(parent=instance, **field_data)

        # Delete fields that are no longer in the list
        instance.fields.filter(id__in=existing_ids).delete()

        return instance