# Generated by Django 3.2.7 on 2021-11-23 22:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ticket', '0006_rename_name_contact_first'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='contact',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='ticket.contact'),
        ),
    ]
