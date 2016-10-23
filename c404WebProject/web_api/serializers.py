from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework.decorators import detail_route
from .models import Author, Post, Comment

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True
            },
        }
        
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
    """
    Serializer used for doing author profile related operations.
    """     
    displayName = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name') 
    email = serializers.CharField(source='user.email') 
    password = serializers.CharField(source='user.password', write_only=True) 

    class Meta:
        model = Author
        fields = ('id', 'displayName', 'password', 'first_name', 'last_name', 
                  'email', 'bio', 'host', 'github_username', 'friends')

    # # Need to be created as User is a nest object of Author.
    # # Returns an author object with user object as an field after extracting data from json.
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_object = User.objects.create_user(**user_data)
        author = Author.objects.create(user=user_object, **validated_data)
        author.save()
        
        return author

class FriendsWithSerializer(serializers.ModelSerializer):
    """
    Serializer used for doing friend related operations.
    """ 
            
    authors = serializers.SerializerMethodField('getFriends')

    class Meta:
        model = Author
        fields = ['authors']

    # Returns a list of friend's id for an author.
    def getFriends(self, obj):
        query = obj.friends.all().values('id')
        res = []
        for item in query:
            res.append(item.values()[0])
        return res