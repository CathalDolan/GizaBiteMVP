# Generated by Django 4.1.5 on 2023-03-31 12:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0032_products'),
    ]

    operations = [
        migrations.RenameField(
            model_name='products',
            old_name='product_name',
            new_name='name',
        ),
    ]
