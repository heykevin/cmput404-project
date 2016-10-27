from django.db import models
from django.contrib.auth.models import User
from .utils import ListField
import uuid

# Create your models here.

class Author(models.Model):
    user = models.OneToOneField(User)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    github_username = models.CharField(max_length=35, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    host = models.URLField()
    friends = models.ManyToManyField("self", blank=True)

    def get_idKey(self):
        return self.idKey

    def get_name(self):
        return self.first_name+" "+self.last_name

    def get_url(self):
        return self.url
        
    def __str__(self):
        return self.user.first_name

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    source = models.CharField(max_length=150)
    origin = models.CharField(max_length=150)
    description = models.CharField(max_length = 50)
    content = models.TextField()
    tag = ListField(blank=True, default=[])
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

    public="1"
    local="2"
    foaf="3"
    local_friends="4"
    list_of_friends="5"
    private="6"

    visibility_choice=(
        (public, 'Public'),
        (local, 'Public to local'),
        (foaf, 'Friends of friends'),
        (local_friends, 'Local friends'),
        (list_of_friends, 'friend selected'),
        (private, 'Myself only')
    )

    visibility=models.CharField(max_length=1, choices=visibility_choice, default=public)

    publish_time=models.DateTimeField(auto_now=True)

    def get_idKey(self):
        return self.idKey()


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(default="")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    publish_time = models.DateTimeField(auto_now=True)
