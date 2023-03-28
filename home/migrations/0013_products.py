# Generated by Django 4.1.5 on 2023-03-23 14:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0012_delete_products'),
    ]

    operations = [
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=254)),
                ('portion_size', models.CharField(blank=True, max_length=254, null=True)),
                ('energy_kcal', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('fat', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('protein', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('carbohydrates', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('salt', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('sugars', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('fibre', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('deep_frying_index', models.IntegerField(blank=True, null=True)),
                ('allergens', models.ManyToManyField(to='home.allergens')),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='category', to='home.maincategories')),
                ('cooked_or_raw', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='home.cookedorraw')),
                ('source', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='home.source')),
                ('sub_category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='subcategory', to='home.subcategories')),
            ],
            options={
                'verbose_name_plural': 'Products',
            },
        ),
    ]