# Generated by Django 4.1.5 on 2023-03-23 15:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0016_remove_products_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='products',
            name='sub_category',
        ),
    ]
