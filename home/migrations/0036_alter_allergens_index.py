# Generated by Django 4.1.5 on 2023-04-04 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0035_alter_allergens_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allergens',
            name='index',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
