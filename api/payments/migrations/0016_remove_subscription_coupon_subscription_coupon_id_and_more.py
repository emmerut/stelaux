# Generated by Django 5.0.6 on 2024-07-31 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0015_paymentintent_product_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscription',
            name='coupon',
        ),
        migrations.AddField(
            model_name='subscription',
            name='coupon_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='subscription',
            name='plan_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='subscription',
            name='price_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='subscription',
            name='product_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='plan',
            field=models.CharField(default='Free', max_length=100),
        ),
    ]
