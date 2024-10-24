# Generated by Django 5.0.6 on 2024-08-24 05:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SimpleContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section', models.CharField(max_length=255)),
                ('charfield', models.CharField(blank=True, max_length=255, null=True)),
                ('textfield', models.TextField(blank=True, null=True)),
                ('number', models.FloatField(blank=True, null=True)),
                ('decimal', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('file_image', models.ImageField(blank=True, null=True, upload_to='media/')),
                ('file_doc', models.FileField(blank=True, null=True, upload_to='docs/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='DynamicField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('charfield', models.CharField(blank=True, max_length=255, null=True)),
                ('textfield', models.TextField(blank=True, null=True)),
                ('number', models.FloatField(blank=True, null=True)),
                ('decimal', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('file_image', models.ImageField(blank=True, null=True, upload_to='media/')),
                ('file_doc', models.FileField(blank=True, null=True, upload_to='docs/')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='fields', to='content.simplecontent')),
            ],
        ),
    ]
