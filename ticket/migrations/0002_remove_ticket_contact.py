# Generated by Django 3.2.7 on 2021-11-23 22:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ticket', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ticket',
            name='contact',
        ),
    ]
