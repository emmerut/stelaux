# Generated by Django 5.0.6 on 2024-09-08 12:34

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0007_remove_dynamicfield_doc_remove_dynamicfield_image_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='simplecontent',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_content', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]