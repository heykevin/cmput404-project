from django.contrib import admin

from .models import Author, Comment, Post, Image, Node, FriendRequest
# Register your models here.

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Author)
admin.site.register(Image)
admin.site.register(Node)
admin.site.register(FriendRequest)
