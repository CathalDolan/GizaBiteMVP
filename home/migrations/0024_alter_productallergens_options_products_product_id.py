# Generated by Django 4.1.5 on 2023-03-24 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0023_rename_allergens_products_allergen'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='productallergens',
            options={'verbose_name_plural': 'Product Allergens'},
        ),
        migrations.AddField(
            model_name='products',
            name='product_id',
            field=models.CharField(blank=True, max_length=254, null=True),
        ),
    ]
