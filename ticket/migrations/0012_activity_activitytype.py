# Generated by Django 3.2.7 on 2021-11-24 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticket', '0011_remove_activity_ticket'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='activityType',
            field=models.CharField(default='Null', max_length=100),
        ),
    ]