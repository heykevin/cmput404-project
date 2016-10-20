from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Author, Comment, Post
# Register your models here.

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Author)
