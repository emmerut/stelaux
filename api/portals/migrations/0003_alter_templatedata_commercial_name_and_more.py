# Generated by Django 5.0.6 on 2024-09-11 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portals', '0002_rename_branding_logo_portalrequirements_file_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='templatedata',
            name='commercial_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='templatedata',
            name='proyect_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]