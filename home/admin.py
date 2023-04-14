from django.contrib import admin
from .models import Products, MainCategories, SubCategories, CookedOrRaw, Source, Allergens, ProductTest, AllergenTest  #, ProductAllergens, AllergenGroup, 
from import_export.admin import ExportActionMixin


# Register your models here.
class AllergensInline(admin.TabularInline):
    model = Products.allergen.through

class AllergenTestInline(admin.TabularInline):
    model = ProductTest.allergen.through

class MainCategoriesAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
    )
    ordering = ('pk',)


class SubCategoriesAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
    )
    ordering = ('pk',)


class CookedOrRawAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
    )
    ordering = ('pk',)


class SourceAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
    )
    ordering = ('pk',)


# class AllergenGroupAdmin(admin.ModelAdmin):
#     list_display = (
#         'pk',
#         'name',
#         'index'
#     )
#     ordering = ('index',)


class AllergensAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
        'group',
        'eu_index',
        'us_index',
    )
    inlines = [
            AllergensInline,
        ]
    ordering = ('eu_index',)


class ProductsAdmin(ExportActionMixin, admin.ModelAdmin):
    list_display = (
        'pk',
        'product_id',
        'category',
        'sub_category',
        'cooked_or_raw',
        'source',
        'name',
        'portion_size',
        'energy_kcal',
        'fat',
        'protein',
        'carbohydrates',
        'salt',
        'sugars',
        'fibre',
        'deep_frying_index',
    )
    inlines = [
        AllergensInline,
    ]
    ordering = ('sub_category',)


# class ProductAllergensAdmin(admin.ModelAdmin):
#     list_display = (
#         'pk',
#         'product',
#         'allergen',
#         'allergen_group',
#     )
#     ordering = ('pk',)


class ProductTestAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
    )
    inlines = [
            AllergenTestInline,
        ]
    ordering = ('pk',)


class AllergenTestAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
        'group',
        'index',
    )
    ordering = ('pk',)


admin.site.register(MainCategories, MainCategoriesAdmin)
admin.site.register(SubCategories, SubCategoriesAdmin)
admin.site.register(CookedOrRaw, CookedOrRawAdmin)
admin.site.register(Source, SourceAdmin)
admin.site.register(Allergens, AllergensAdmin)
# admin.site.register(AllergenGroup, AllergenGroupAdmin)
admin.site.register(Products, ProductsAdmin)
# admin.site.register(ProductAllergens, ProductAllergensAdmin)
admin.site.register(ProductTest, ProductTestAdmin)
admin.site.register(AllergenTest, AllergenTestAdmin)
