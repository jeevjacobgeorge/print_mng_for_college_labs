# Generated by Django 5.0.2 on 2024-02-23 11:33

import django.db.models.deletion
import studapi.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studapi', '0002_experiment'),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('batch', models.CharField(max_length=3)),
                ('roll_no', models.IntegerField()),
                ('file', models.FileField(upload_to=studapi.models.file_upload_location)),
                ('exp_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='studapi.experiment')),
                ('lab_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='studapi.lab')),
            ],
        ),
    ]
