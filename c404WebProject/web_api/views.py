from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.parsers import JSONParser
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from django.contrib.auth.models import User, Group
from .models import Author, Post
from serializers import *
import json

        
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

    """
    POST /author/
    Request:
        displayname (string)
        password (string)
        first_name (string)
        password (string)
        email (string)
        bio (string)
        host (string)
        github_username (string)
        friends (list)
    Response:
        displayname (string)
        password (string)
        first_name (string)
        password (string)
        email (string)
        bio (string)
        host (string)
        github_username (string)
        friends (list)
        id (UUID)
    """    
    def post(self, request):
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
'''   
class PostView(APIView):
    
    def get(self, request, pk, format=None):
        queryset = Post.objects.get(id=pk)
        serializer = PostSerializer(queryset)
        return Response(serializer.data)
'''
# postview set
class PostViewSet(viewsets.ModelViewSet):    
    # shows all authors post lists
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    # get specific post from an author
    def get(self, request, pk, format=None):
        queryset = Post.objects.get(id=pk)
        serializer_class = PostSerializer(queryset)
        return Response(serailzer.data)

    def post(self,request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentView(APIView):

    def get(self, request, pk, format=None):
        post = Post.objects.get(id=pk)
        queryset = Comment.objects.filter(post=post)
        serializer = CommentSerializer(queryset)
        return Response(serializer.data)

class FriendsWith(APIView):
    """
    GET /friends/<authorID>
    Response:
        authors (list): containing friend list of author
    """ 
    def get(self, request, pk, format=None):
        queryset = Author.objects.get(id=pk)
        serializer = FriendsWithSerializer(queryset)
        res=serializer.data
        res['query']='friends'
        return Response(res)
    
    """
    POST /friend/<authorID>
    Request:
        query (string): "friends"
        author (string): id of current author
        authors (list): list of authors to check friendship
    Response:
        query (string): "friends"
        author (string): id of current author
        authors (list): list of authors that are friends
    """
    def post(self, request, pk, format=None):
        friend_queryset = Author.objects.get(id=request.data['author']).friends.all()
        request_list = request.data['authors']
        match_list = []
        for friend in request_list:
            if friend_queryset.filter(id=friend).exists():
                match_list.append(friend)

        res = dict()
        res['authors'] = match_list
        res['author'] = request.data['author']
        res['query'] = 'friends'
        return Response(res)

class FriendCheck(APIView):
    """
    GET /friends/<authorID1>/<authorID2>
    Response: 
        query (string): "friends"
        authors (string): ids of checked authors
        friends (bool): true iff friends
    """
    def get(self, request, id1, id2, format=None):
        try:
            queryset1 = Author.objects.get(id=id1)
            queryset2 = Author.objects.get(id=id2)
        except Author.DoesNotExist:
            return Response('', 404)

        list1 = [str(id['id']) for id in queryset1.friends.all().values('id')]
        list2 = [str(id['id']) for id in queryset2.friends.all().values('id')]
        res = dict()
        res['authors'] = [id1, id2]
        res['query'] = "friends"
        res['friends'] = (id1 in list2 and id2 in list1)
        return Response(res)
