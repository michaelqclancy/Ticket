# Generated by Django 3.2.7 on 2021-11-23 22:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ticket', '0005_auto_20211123_1730'),
    ]

    operations = [
        migrations.RenameField(
            model_name='contact',
            old_name='name',
            new_name='first',
        ),
    ]