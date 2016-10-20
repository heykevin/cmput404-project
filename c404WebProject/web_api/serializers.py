from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import Author

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class AuthorSerializer(serializers.ModelSerializer):
    displayName = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')
    
    class Meta:
        model = Author
        fields = ('id','bio', 'displayName', 'url', 'git',
          'first_name', 'last_name', 'email')

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
