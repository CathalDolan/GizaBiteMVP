# Generated by Django 4.1.5 on 2023-03-23 14:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0011_rename_fat_products_fat_rename_fibre_products_fibre_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Products',
        ),
    ]