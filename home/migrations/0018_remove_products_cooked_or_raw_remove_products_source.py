# Generated by Django 4.1.5 on 2023-03-23 15:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0017_remove_products_sub_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='products',
            name='cooked_or_raw',
        ),
        migrations.RemoveField(
            model_name='products',
            name='source',
        ),
    ]