# Generated by Django 4.1.5 on 2023-03-21 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0004_subcategories'),
    ]

    operations = [
        migrations.CreateModel(
            name='CookedOrRaw',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=254)),
            ],
            options={
                'verbose_name_plural': 'Cooked or Raw',
            },
        ),
    ]