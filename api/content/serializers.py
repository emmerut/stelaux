from rest_framework import serializers
from .models import SimpleContent, DynamicField

class DynamicFieldSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, write_only=True)  
    value = serializers.CharField(allow_blank=True, required=False, write_only=True)  
    file_image = serializers.ImageField(required=False, allow_null=True, write_only=True)
    file_doc = serializers.FileField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = DynamicField
        fields = ['id', 'parent', 'title', 'subtitle', 'content', 'options', 'number', 'decimal', 'urlfield', 'file_image', 'file_doc', 'name', 'value']

    def create(self, validated_data):
        # Obtener el nombre del campo dinámico del diccionario de datos validados
        field_name = validated_data.pop('name', None)

        # Obtener el valor del campo dinámico basado en el tipo de campo
        field_value = validated_data.pop('value', None)

        # Crear la instancia del campo dinámico con los datos validados
        instance = super().create(validated_data)

        # Asignar el valor al campo correspondiente en el modelo
        if field_name:
            setattr(instance, field_name, field_value)

        # Guardar la instancia del campo dinámico
        instance.save()
        return instance

class DynamicFormEntrySerializer(serializers.ModelSerializer):
    fields = DynamicFieldSerializer(many=True)
    file_image = serializers.ImageField(required=False, allow_null=True, write_only=True)
    file_doc = serializers.FileField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = SimpleContent
        fields = ['id', 'created_at', 'fields', 'section', 'title', 'subtitle', 'content', 'options', 'number',
                  'decimal', 'urlfield', 'file_image', 'file_doc']

    def create(self, validated_data):
        # Extraer campos dinámicos y archivos
        fields_data = validated_data.pop('fields')
        file_image = validated_data.pop('file_image', None)
        file_doc = validated_data.pop('file_doc', None)

        # Crear la entrada del formulario
        form_entry = SimpleContent.objects.create(**validated_data)

        # Guardar archivos de SimpleContent
        if file_image:
            form_entry.file_image = file_image
        if file_doc:
            form_entry.file_doc = file_doc
        form_entry.save()

        # Crear campos dinámicos
        for field_data in fields_data:
            # Obtener archivos de campos anidados
            file_image = field_data.pop('file_image', None)
            file_doc = field_data.pop('file_doc', None)

            # Crear campo dinámico
            dynamic_field = DynamicField.objects.create(parent=form_entry, **field_data)

            # Guardar archivos del campo dinámico
            if file_image:
                dynamic_field.file_image = file_image
            if file_doc:
                dynamic_field.file_doc = file_doc
            dynamic_field.save()

        return form_entry

