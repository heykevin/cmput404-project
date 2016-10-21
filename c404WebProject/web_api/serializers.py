from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework.decorators import detail_route
from .models import Author, Post, Comment

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'tag', 'author')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'content', 'author')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class AuthorSerializer(serializers.ModelSerializer):
    displayName = serializers.CharField(source='user.username')
    
    user=UserSerializer()
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_object = User.objects.create(**user_data)
        
        author = Author.objects.create(user=user_object, **validated_data)
        author.save()
        
        return author
        
       
    class Meta:
        model = Author
        fields = ('id', 'user', 'displayName', 'bio', 'url', 'git')

class FriendsWithSerializer(serializers.ModelSerializer):

    authors = serializers.SerializerMethodField('getFriends')

    class Meta:
        model = Author
        fields = ['authors']

    def getFriends(self, obj):
        print obj
        query = obj.friends.all().values('id')
        print query
        res = []
        for item in query:
            print item
            res.append(item.values()[0])
        return res