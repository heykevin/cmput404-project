# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-27 23:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web_api', '0005_post_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='friend_request_received',
            field=models.ManyToManyField(blank=True, related_name='_author_friend_request_received_+', to='web_api.Author'),
        ),
        migrations.AddField(
            model_name='author',
            name='friend_request_sent',
            field=models.ManyToManyField(blank=True, related_name='_author_friend_request_sent_+', to='web_api.Author'),
        ),
    ]