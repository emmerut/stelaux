# Generated by Django 5.0.6 on 2024-06-26 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_customuser_full_name_customuser_birthday_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='reset_password_expires',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='reset_password_token',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
