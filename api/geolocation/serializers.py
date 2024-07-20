from rest_framework import serializers
from .models import Country, Region, SubRegion, City


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        country_code = kwargs.pop("country_code", None)
        super(RegionSerializer, self).__init__(*args, **kwargs)
        if country_code:
            self.fields["regions"] = serializers.SerializerMethodField()
            self.country_code = country_code

    def get_regions(self):
        regions = Region.objects.filter(country__name=self.country_code)
        return regions
