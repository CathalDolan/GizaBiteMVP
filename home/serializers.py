from rest_framework import serializers
from . models import Products, Allergens, ProductTest, AllergenTest


class AllergensSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergens
        fields = '__all__'


class ProductsSerializer(serializers.ModelSerializer):
    allergen = AllergensSerializer(read_only=True, many=True)
    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    sub_category = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    cooked_or_raw = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    source = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = Products
        fields = '__all__'


class AllergenTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergens
        fields = '__all__'


class ProductTestSerializer(serializers.ModelSerializer):
    allergen = AllergenTestSerializer(many=True)

#     class Meta:
#         model = Products
#         fields = '__all__'
