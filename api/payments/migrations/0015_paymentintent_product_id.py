# Generated by Django 5.0.6 on 2024-07-31 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0014_coupon_subscription_coupon'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymentintent',
            name='product_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
