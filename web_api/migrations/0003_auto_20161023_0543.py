# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-23 05:43
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('web_api', '0002_comment_content'),
    ]

    operations = [
        migrations.RenameField(
            model_name='author',
            old_name='git',
            new_name='github_username',
        ),
        migrations.RenameField(
            model_name='author',
            old_name='url',
            new_name='host',
        ),
    ]