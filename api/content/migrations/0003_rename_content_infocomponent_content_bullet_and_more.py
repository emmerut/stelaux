# Generated by Django 5.0.6 on 2024-05-26 04:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0002_article_component_infocomponent_content_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='infocomponent',
            old_name='content',
            new_name='content_bullet',
        ),
        migrations.RenameField(
            model_name='infocomponent',
            old_name='title',
            new_name='title_bullet',
        ),
    ]