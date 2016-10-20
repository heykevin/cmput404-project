from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import viewsets
from django.contrib.auth.models import User, Group
from serializers import UserSerializer, GroupSerializer, AuthorSerializer, FriendsWithSerializer, PostSerializer, CommentSerializer
from .models import Author, Post, Comment
from rest_framework.response import Response
        
class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class PostView(APIView):
    def get(self,request,pk,format=None):
        queryset = Post.objects.get(id=pk)
        serializer = PostSerializer(queryset)
        return Response(serializer.data)

class CommentView(APIView):
    def get(self,request,pk,format=None):
        queryset = Comment.objects.get(id=pk)
        serializer = CommentSerializer(queryset)
        return Response(serializer.data)

class FriendsWith(APIView):
    def get(self, request, pk, format=None):
        queryset = Author.objects.get(id=pk)
        serializer = FriendsWithSerializer(queryset)
        return Response(serializer.data)