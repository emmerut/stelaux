# Generated by Django 5.0.6 on 2024-07-31 19:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0016_remove_subscription_coupon_subscription_coupon_id_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Coupon',
        ),
    ]
