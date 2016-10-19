from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Author, Comment, Post
# Register your models here.


class AuthorAdmin(admin.ModelAdmin):
    readonly_fields = ('user',)
    list_display = ['user', 'url']
    ordering = ['user']

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Author, AuthorAdmin)
