from django.db import models

import uuid

# Create your models here.

class Post(models.Model):
    idKey=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    title=models.CharField(max_length=500)
    content=models.TextField()
    
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
    
    email=models.EmailField()
    password
    
    url=model.URLField()
    
    friends=models.ManyToManyField(Author)
                

class Comment(models.Model):
    idKey=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    