from django.contrib import admin

from .models import *
# Register your models here.

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Author)
admin.site.register(Image)
admin.site.register(Node)
admin.site.register(FriendRequest)
admin.site.register(ForeignPost)
admin.site.register(RemoteComment)
