from rest_framework import serializers
from . models import Allergens, Products


class AllergensSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergens
        fields = ['index']


class ProductsSerializer(serializers.ModelSerializer):
    Allergens = AllergensSerializer(read_only=True, many=True)

    class Meta:
        model = Products
        fields = '__all__'
