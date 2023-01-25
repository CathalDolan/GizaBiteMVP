from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Allergens, Products


# Register your models here.
class AllergensInline(admin.TabularInline):
    model = Products.Allergens.through


class AllergensAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
        'index',
    )
    inlines = [
            AllergensInline,
        ]
    ordering = ('pk',)


class ProductsAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'product_name',
        'EnergyKjoules',
        'EnergyKcal',
        'Fat',
        'Protein',
        'Carbohydrates',
        'Salt',
        'Sugars',
        'Fibre',
    )
    inlines = [
        AllergensInline,
    ]
    ordering = ('pk',)


admin.site.register(Allergens, AllergensAdmin)
admin.site.register(Products, ProductsAdmin)
