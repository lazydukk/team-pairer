# Generated by Django 4.1 on 2022-10-27 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0004_alter_result_score1_alter_result_score2'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournamentround',
            name='num_rounds',
            field=models.IntegerField(default=5),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='tournamentround',
            name='team_size',
            field=models.IntegerField(default=5),
            preserve_default=False,
        ),
    ]
