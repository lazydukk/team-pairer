# Generated by Django 4.2 on 2023-07-15 04:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ratings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='wesparating',
            name='country',
            field=models.CharField(default='', max_length=4),
            preserve_default=False,
        ),
    ]
