from django.db import models
from django.contrib.auth.models import User
# from .utils import ListField
import uuid

# Create your models here.

class Author(models.Model):
    user = models.OneToOneField(User)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    github_username = models.CharField(max_length=35, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    host = models.URLField()
    friends = models.ManyToManyField("self", blank=True)
    
    def get_request_sent(self):
        res=[]
        for object in FriendRequest.objects.filter(sender=self.id):
            res.append(object.receiver)
        return res
    
    def get_request_received(self):
        res=[]
        for object in FriendRequest.objects.filter(receiver=self.id):
            res.append(object.sender)
        return res    
        
    def __str__(self):
        return self.user.username
    
class FriendRequest(models.Model):
    sender = models.ForeignKey(Author, related_name="request_sent", on_delete=models.CASCADE)
    receiver = models.ForeignKey(Author, related_name="request_received", on_delete=models.CASCADE)   

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    source = models.URLField()
    origin = models.URLField(editable=False)
    description = models.CharField(max_length = 50)
    content = models.TextField()
    category = models.CharField(blank=True, null=True, default='', max_length = 50)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    text_plain="text/plain"
    text_markdown="text/markdown"

    content_type=(
        (text_plain, 'text/plain'),
        (text_markdown, 'text/markdown')
    )

    public="PUBLIC"
    local="SERVERONLY"
    foaf="FOAF"
    list_of_friends="FRIENDS"
    private="PRIVATE"

    visibility_choice=(
        (public, 'Public'),
        (local, 'Local only'),
        (foaf, 'Friends of friends'),
        (list_of_friends, 'Friends'),
        (private, 'Myself only')
    )

    visibility=models.CharField(max_length=20, choices=visibility_choice, default=public)

    publish_time=models.DateTimeField(auto_now=True)

    content_type=models.CharField(max_length=15, choices=content_type, default=text_markdown)
        
    def get_count(self):
        return self.objects.count()

    def __str__(self):
        return self.title

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(default="")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    publish_time = models.DateTimeField(auto_now=True)
