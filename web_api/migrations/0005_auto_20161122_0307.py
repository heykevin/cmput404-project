# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-22 03:07
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('web_api', '0004_auto_20161120_2342'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='publish_time',
            new_name='published',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='content_type',
            new_name='contentType',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='publish_time',
            new_name='published',
        ),
    ]