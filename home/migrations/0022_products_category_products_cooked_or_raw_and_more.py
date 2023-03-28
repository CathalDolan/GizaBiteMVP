# Generated by Django 4.1.5 on 2023-03-23 18:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0021_remove_products_deep_frying_index'),
    ]

    operations = [
        migrations.AddField(
            model_name='products',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='category', to='home.maincategories'),
        ),
        migrations.AddField(
            model_name='products',
            name='cooked_or_raw',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='home.cookedorraw'),
        ),
        migrations.AddField(
            model_name='products',
            name='deep_frying_index',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='products',
            name='energy_kcal',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='products',
            name='portion_size',
            field=models.CharField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='products',
            name='source',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='home.source'),
        ),
        migrations.AddField(
            model_name='products',
            name='sub_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='subcategory', to='home.subcategories'),
        ),
        migrations.CreateModel(
            name='ProductAllergens',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('allergen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.allergens')),
                ('allergen_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.allergengroup')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.products')),
            ],
        ),
        migrations.RemoveField(
            model_name='Products',
            name='allergens',),
        migrations.AddField(
            model_name='products',
            name='allergens',
            field=models.ManyToManyField(through='home.ProductAllergens', to='home.allergens'),
        ),
    ]