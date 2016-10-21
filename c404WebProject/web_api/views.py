from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from django.contrib.auth.models import User, Group
from serializers import UserSerializer, GroupSerializer, AuthorSerializer, FriendsWithSerializer, PostSerializer, CommentSerializer 
from .models import Author, Post, Comment

        
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
    
    
    @detail_route(methods=['post'])
    def create_author(self,request):
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST) 
    
    
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
    
    def get(self,request,pk,format=None):
        queryset = Author.objects.get(id=pk)
        serializer = FriendsWithSerializer(queryset)
        return Response(serializer.data)

class FriendCheck(APIView):
    
    def get(self,request,id1,id2,format=None):
        obj1 = Author.objects.get(id=id1)
        obj2 = Author.objects.get(id=id2)
        list1 = obj1.friends.all().values('id')
        list2 = obj2.friends.all().values('id')

        left_side_check,right_side_check=False,False

        for item in list1:
            if str(item.values()[0])==str(id2):
                left_side_check=True
                break
        
        for item in list2:
            if str(item.values()[0])==str(id1):
                right_side_check=True
                break        
        
        if(left_side_check and right_side_check):
            return Response(True)
        
        return Response(False)
