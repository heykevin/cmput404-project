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
    url = models.URLField(default="http://127.0.0.1:8000")
    host = models.URLField(default="http://127.0.0.1:8000")
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

class Node(models.Model):
    node_url = models.URLField()
    access_to_posts = models.BooleanField()
    access_to_images = models.BooleanField()
    
    username = models.CharField(max_length=50, null=True)
    password = models.CharField(max_length=50, null=True)
    
    user = models.OneToOneField(Author)

    def __str__(self):
        return self.node_url

class FriendRequest(models.Model):
    sender = models.ForeignKey(Author, related_name="request_sent", on_delete=models.CASCADE)
    receiver = models.ForeignKey(Author, related_name="request_received", on_delete=models.CASCADE)

def folder_name(instance, filename):
    return '{0}/{1}'.format(instance.id, filename)

class Image(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Author, on_delete=models.CASCADE)
    origin = models.URLField(editable=False, default="http://127.0.0.1:8000")
    photo = models.ImageField(upload_to=folder_name)

class ForeignPost(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    source = models.URLField(blank=True,)
    origin = models.URLField(blank=True,)
    description = models.CharField(max_length = 50)
    content = models.TextField()
    category = models.CharField(blank=True, null=True, default='', max_length = 50)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, null=True)
    text_plain="text/plain"
    text_markdown="text/markdown"
    text_xmarkdown="text/x-markdown"
    contentType=(
        (text_plain, 'text/plain'),
        (text_markdown, 'text/markdown'),
        (text_xmarkdown, 'text/x-markdown')
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
    published=models.DateTimeField()
    contentType=models.CharField(max_length=15, choices=contentType, default=text_markdown)

    def get_count(self):
        return self.objects.count()

    def __str__(self):
        return self.title

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    source = models.URLField(blank=True,)
    origin = models.URLField(editable=False)
    description = models.CharField(max_length = 50)
    content = models.TextField()
    category = models.CharField(blank=True, null=True, default='', max_length = 50)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    text_plain="text/plain"
    text_markdown="text/markdown"

    contentType=(
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
    published=models.DateTimeField(auto_now=True)
    contentType=models.CharField(max_length=15, choices=contentType, default=text_markdown)


    def get_count(self):
        return self.objects.count()

    def __str__(self):
        return self.title

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(default="")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    published = models.DateTimeField(auto_now=True)


class RemoteComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(default="")
    post = models.ForeignKey(ForeignPost, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    published = models.DateTimeField(auto_now=True)

