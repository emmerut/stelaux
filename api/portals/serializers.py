from rest_framework import serializers
from .models import Category, TemplateData, PortalRequirements, DomainRegistration, Portals
from users.models import CustomUser as User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class TemplateDataSerializer(serializers.ModelSerializer):
    categoria = serializers.StringRelatedField(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = TemplateData
        fields = ['id', 'proyect_name', 'commercial_name', 'categoria', 'user', 'domain', 'thumbnail']

class PortalRequirementsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PortalRequirements
        fields = ['id', 'project_type', 'file_image', 'primary_color', 'alternate_color', 'project_voice', 'user']

class DomainRegistrationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DomainRegistration
        fields = ['id', 'domain_name', 'registration_date', 'registration_duration', 'registration_type', 'registration_status', 'registration_price', 'payment_date', 'user']

class PortalsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    domain_registration = DomainRegistrationSerializer(read_only=True)
    template_model = TemplateDataSerializer(read_only=True)
    requirement_data = PortalRequirementsSerializer(read_only=True)

    class Meta:
        model = Portals
        fields = ['id', 'user', 'domain_registration', 'template_model', 'requirement_data', 'status', 'current_step']

    def get_requirement_data(self, obj):
        user_id = self.context['used_id']
        return PortalRequirements.objects.filter(user_id=user_id, id=obj.requirement_data.id).values()

class CreateTemplateDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateData
        fields = ['proyect_name', 'commercial_name', 'categoria', 'user', 'domain', 'thumbnail']

class CreatePortalRequirementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalRequirements
        fields = ['user', 'project_type', 'file_image', 'primary_color', 'alternate_color', 'project_voice', 'user']

class CreateDomainRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DomainRegistration
        fields = ['user', 'domain_name', 'registration_date', 'registration_duration', 'registration_type', 'registration_status', 'registration_price', 'payment_date', 'user']

class CreatePortalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portals
        fields = ['user', 'domain_registration', 'template_model']
