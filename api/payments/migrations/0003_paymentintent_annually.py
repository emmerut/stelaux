# Generated by Django 5.0.6 on 2024-07-16 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0002_alter_subscription_plan_paymentintent'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymentintent',
            name='annually',
            field=models.BooleanField(default=False),
        ),
    ]