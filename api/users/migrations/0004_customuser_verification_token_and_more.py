# Generated by Django 5.0.6 on 2024-06-26 12:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_customuser_reset_password_expires_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='verification_token',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='verification_token_expires',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
