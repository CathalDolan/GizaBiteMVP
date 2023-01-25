from django.db import models

# Create your models here.
from django.db import models


# Create your models here.
class Allergens(models.Model):
    class Meta:
        verbose_name_plural = 'Allergens'
    name = models.CharField(max_length=254,
                            null=False,
                            blank=False)
    index = models.IntegerField(null=False,
                                blank=False)

    def __str__(self):
        return self.name


class Products(models.Model):
    class Meta:
        verbose_name_plural = 'Products'

    product_name = models.CharField(max_length=254,
                                    null=False,
                                    blank=False)
    EnergyKjoules = models.DecimalField(null=True,
                                        blank=True,
                                        max_digits=10,
                                        decimal_places=2)
    EnergyKcal = models.DecimalField(null=True,
                                     blank=True,
                                     max_digits=10,
                                     decimal_places=2)
    Fat = models.DecimalField(null=True,
                              blank=True,
                              max_digits=10,
                              decimal_places=2)
    Protein = models.DecimalField(null=True,
                                  blank=True,
                                  max_digits=10,
                                  decimal_places=2)
    Carbohydrates = models.DecimalField(null=True,
                                        blank=True,
                                        max_digits=10,
                                        decimal_places=2)
    Salt = models.DecimalField(null=True,
                               blank=True,
                               max_digits=10,
                               decimal_places=2)
    Sugars = models.DecimalField(null=True,
                                 blank=True,
                                 max_digits=10,
                                 decimal_places=2)
    Fibre = models.DecimalField(null=True,
                                blank=True,
                                max_digits=10,
                                decimal_places=2)
    Allergens = models.ManyToManyField(Allergens,
                                       blank=True,
                                       related_name='allergens')

    def __str__(self):
        return self.product_name
