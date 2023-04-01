from django.db import models
# from gsheets import mixins
# from uuid import uuid4


# class DummySpreadSheet(mixins.SheetPullableMixin, models.Model):
#     spreadsheet_id = '1z1wufrAIa2xE6tXW4MIW6c2rTkyBYgkCqhgxDWHYdmY'
#     model_id_field = 'guid'

#     guid = models.CharField(primary_key=True, max_length=255, default=uuid4)

#     first_name = models.CharField(max_length=127)
#     last_name = models.CharField(max_length=127)
#     email = models.CharField(max_length=127, null=True, blank=True, default=None)
#     phone = models.CharField(max_length=127, null=True, blank=True, default=None)

#     def __str__(self):
#         return f'{self.first_name} {self.last_name} // {self.email} ({self.guid})'


class MainCategories(models.Model):
    class Meta:
        verbose_name_plural = 'Main Categories'
    name = models.CharField(max_length=254,
                            null=False,
                            blank=False)

    def __str__(self):
        return self.name


class SubCategories(models.Model):
    class Meta:
        verbose_name_plural = 'Sub Categories'
    name = models.CharField(max_length=254,
                            null=False,
                            blank=False)

    def __str__(self):
        return self.name


class CookedOrRaw(models.Model):
    class Meta:
        verbose_name_plural = 'Cooked or Raw'
    name = models.CharField(max_length=254,
                            null=False,
                            blank=False)

    def __str__(self):
        return self.name


class Source(models.Model):
    class Meta:
        verbose_name_plural = 'Source'
    name = models.CharField(max_length=254,
                            null=False,
                            blank=False)

    def __str__(self):
        return self.name


# Create your models here.
class Allergens(models.Model):
    class Meta:
        verbose_name_plural = 'Allergens'
    name = models.CharField(max_length=254,
                            null=False,
                            blank=False)

    def __str__(self):
        return self.name


class AllergenGroup(models.Model):
    class Meta:
        verbose_name_plural = 'Allergen Group'
    name = models.CharField(max_length=254,
                            null=False,
                            blank=False)
    index = models.IntegerField(null=True,
                                blank=True)

    def __str__(self):
        return self.name


class Products(models.Model):
    class Meta:
        verbose_name_plural = 'Products'
    product_id = models.CharField(max_length=254,
                                  null=True,
                                  blank=True)
    category = models.ForeignKey(MainCategories,
                                 on_delete=models.PROTECT,
                                 null=True,
                                 blank=True,
                                 related_name='category')
    sub_category = models.ForeignKey(SubCategories,
                                     on_delete=models.PROTECT,
                                     null=True,
                                     blank=True,
                                     related_name='subcategory')
    cooked_or_raw = models.ForeignKey(CookedOrRaw,
                                      on_delete=models.PROTECT,
                                      null=True,
                                      blank=True)
    source = models.ForeignKey(Source,
                               on_delete=models.PROTECT,
                               null=True,
                               blank=True)
    product_name = models.CharField(max_length=254,
                                    null=False,
                                    blank=False)
    portion_size = models.CharField(max_length=254,
                                    null=True,
                                    blank=True)
    energy_kcal = models.DecimalField(null=True,
                                      blank=True,
                                      max_digits=10,
                                      decimal_places=2)
    fat = models.DecimalField(null=True,
                              blank=True,
                              max_digits=10,
                              decimal_places=2)
    protein = models.DecimalField(null=True,
                                  blank=True,
                                  max_digits=10,
                                  decimal_places=2)
    carbohydrates = models.DecimalField(null=True,
                                        blank=True,
                                        max_digits=10,
                                        decimal_places=2)
    salt = models.DecimalField(null=True,
                               blank=True,
                               max_digits=10,
                               decimal_places=2)
    sugars = models.DecimalField(null=True,
                                 blank=True,
                                 max_digits=10,
                                 decimal_places=2)
    fibre = models.DecimalField(null=True,
                                blank=True,
                                max_digits=10,
                                decimal_places=2)
    allergens = models.ManyToManyField(Allergens,
                                       through="ProductAllergens")
    deep_frying_index = models.IntegerField(null=True,
                                            blank=True)

    def __str__(self):
        return self.product_name


class ProductAllergens(models.Model):
    class Meta:
        verbose_name_plural = 'Product Allergens'
    product = models.ForeignKey(Products,
                                on_delete=models.CASCADE)
    allergen = models.ForeignKey(Allergens,
                                 on_delete=models.CASCADE)
    allergen_group = models.ForeignKey(AllergenGroup,
                                       on_delete=models.CASCADE)
