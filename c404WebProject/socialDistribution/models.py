from django.db import models

import uuid

# Create your models here.

class Post(models.Model):
    idKey=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    title=models.CharField(max_length=500)
    content=models.TextField()
    tag=models.ForeignKey(Tag,on_delete=models.CASCADE)
    author=models.ForeignKey(Author,on_delete=models.CASCADE)
    
    public="1"
    local="2"
    foaf="3"
    localfriends="4"
    list_of_friends="5"
    private="6"
    
    visuability_choice=(
        (public,'Public'),
        (local,'Public to local'),
        (foaf,'Friends of friends'),
        (local_friends,'Local friends'),
        (list_of_friends,'friend selected'),
        (private,'Myself only')
    )
    visuability=models.CharField(max_length=1,choices=visuability_choice,default=public)
    
    list_of_friends_can_view=models.ManyToManyField(Author)
    
    publish_time=models.DateTimeField(auto_now=True)
    
    
    def get_idKey(self):
        return self.idKey()


class Author(models.Model):
    idKey=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    first_name=models.CharField(max_length=20)
    last_name=models.CharField(max_length=20)
    githubName=models.CharField(max_length=35)
    bio=models.TextField()
    email=models.EmailField()
    url=model.URLField()
    friends=models.ManyToManyField(Author)
    
    def get_idKey(self):
        return self.idKey
    
    def get_name(self):
        return self.first_name+" "+self.last_name
    
    def get_url(self):
        return self.url
                

class Comment(models.Model):
    idKey=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    author=models.ForeignKey(Author,on_delete=models.CASCADE)
    publish_time=models.DateTimeField(auto_now=True)

class TagForPost(models.Model):
    tag=models.CharField(max_Length=20)
    
    def __str__(self):
        return self.tag
    