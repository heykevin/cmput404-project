from django.http import HttpResponse
from django.contrib.auth import login, logout
from django.contrib.auth.models import User, Group
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser  
from rest_framework.authentication import BasicAuthentication 
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework import viewsets, generics
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from .permissions import IsAuthorOrReadOnly
from .models import Author, Post
from serializers import *
import json

class PostsResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            "query": "posts",
            "size": self.page_size,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'posts': data
        })

class CommentResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            "query": "comments",
            "size": self.page_size,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'comments': data
        })

class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

"""
GET /author/posts
Requires Auth
Response:
    query (string)
    size (int)
    next (string)
    prev (string)
    posts (list of posts with comments)
"""    
class AuthorStream(generics.ListAPIView):
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated,)

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostsResultsSetPagination

    def get_queryset(self):
        # when declaring authentication, user can be found in request
        user = self.request.user
        # could refactor to use permissions but whatevs
        postsQuerySet = Post.objects.all().filter(visibility="PUBLIC")
        privateQuerySet = Post.objects.all().filter(visibility="PRIVATE").filter(author__user=user)
        serverQuerySet = Post.objects.all().filter(visibility="SERVERONLY")

        # get friends and foaf posts
        for friend in Author.objects.get(user=user).friends.all():
            friendQuerySet = Post.objects.all().filter(author=friend).exclude(visibility="PRIVATE")
            for foaf in friend.friends.all():
                foafQuerySet = Post.objects.all().filter(author=foaf).filter(visibility="FOAF")

            
        querySet = postsQuerySet | privateQuerySet | serverQuerySet | friendQuerySet | foafQuerySet

        return querySet

"""
GET /author/<authorID>/posts
Requires Auth
Response:
    query (string)
    size (int)
    next (string)
    prev (string)
    posts (list of posts)
""" 
class PersonalAuthorStream(generics.ListAPIView):
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated,)

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostsResultsSetPagination

    def get_queryset(self):
        # when declaring authentication, user can be found in request
        authorId = self.request.parser_context.get('kwargs').get('pk')
        user = self.request.user
        author = Author.objects.get(id=authorId)
        # could refactor to use permissions but whatevs
        authorPosts = Post.objects.all().filter(author=author)
        publicPosts = authorPosts.all().filter(visibility="PUBLIC")
        serverPosts = authorPosts.all().filter(visibility="SERVERONLY")
        privatePosts = authorPosts.all().filter(visibility="PRIVATE").filter(author__user=user)
        foafPosts = authorPosts.all().filter(visibility="FOAF").filter(author__user=user)

        querySet = publicPosts | serverPosts | foafPosts | privatePosts

        if author.friends.all().filter(user=user):
            querySet = querySet | authorPosts.all().filter(visibility="FRIENDS")
    
        return querySet
    
class AuthorViewSet(APIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    """
    POST /author/
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
    def get(self, request):
        queryset = Author.objects.all()
        serializer = AuthorSerializer(queryset, many=True)
        return Response(serializer.data)

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
    
class AuthorProfileUpdateView(APIView):
    serializer_class = AuthorSerializer
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthorOrReadOnly, )
    '''
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
    Response (author object):
        displayname (string)
        password (string)
        first_name (string)
        password (string)
        email (string)
        bio (string)
        host (string)
        github_username (string)
        friends (list)
    '''
    def put(self, request, pk):
        authorObj = Author.objects.get(id=pk)
        serializer = AuthorSerializer(authorObj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk):
        authorObj = Author.objects.get(id=pk)
        serializer = AuthorSerializer(authorObj)
        return Response(serializer.data, status=status.HTTP_200_OK)
'''   
class PostView(APIView):
    
    def get(self, request, pk, format=None):
        queryset = Post.objects.get(id=pk)
        serializer = PostSerializer(queryset)
        return Response(serializer.data)
'''
class PostView(viewsets.ModelViewSet):
    # shows all authors post lists
    #
    # GET /posts
    # #
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostsResultsSetPagination
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthorOrReadOnly, )
    # serializer = PostSerializer(queryset)

    # get specific post from an author
    #
    # GET /posts/<postID>
    #
    def get_queryset(self):
        return Post.objects.all().filter(visibility="PUBLIC")

    # POST post by an author
    #
    # POST
    #
    def post(self,request):
        print request.data
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostIDView(APIView):

    def get(self, request, pk, format=None):
        if Post.objects.filter(id=pk).exists():
            queryset = Post.objects.filter(id=pk)
            serializer = PostSerializer(queryset, many=True)
            res = dict()
            res["posts"] = serializer.data
            return Response(res, status=status.HTTP_200_OK)
        return Response("The post id does not exist", status=status.HTTP_400_BAD_REQUEST)
        
class CommentView(generics.ListCreateAPIView):

    # GET comment from specific post_id
    queryset = Post.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated, )
    pagination_class = CommentResultsSetPagination

    def post(self, request, pk):
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, pk, format=None):
    #     post = Post.objects.get(id=pk)
    #     queryset = Comment.objects.get(post=post)
    #     serializer = CommentSerializer(queryset)
    #     serializer.delete()
    #     return Response("comment has been deleted", status=status.HTTP_204_NO_CONTENT)


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
        if request.data['query'] != 'friends':
            return Response("Incorrect request field: 'query' field should be 'friends'.", status.HTTP_400_BAD_REQUEST)
        
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

class FriendRequestView(APIView):
    
    # Handles the request creation
    def post_request(self, request_data):
        
        # This only works with local author at this time.
        senderObj = Author.objects.get(id=request_data['author']["id"])
        receiverObj = Author.objects.get(id=request_data['friend']["id"])
        
        # Handle the case which sender and receiver are already friends.        
        if senderObj.friends.all().filter(id=receiverObj.id).exists():
            return Response("Already friends.", status.HTTP_400_BAD_REQUEST)
        
        if FriendRequest.objects.filter(sender=senderObj, receiver=receiverObj).exists():
            return Response("Friend request already sent.", status.HTTP_400_BAD_REQUEST)
        
        if FriendRequest.objects.filter(sender=senderObj, receiver=receiverObj).exists():
            return Response("Friend request sent by receiver.", status.HTTP_400_BAD_REQUEST)        
         
        friend_request = FriendRequest.objects.create(sender=senderObj, receiver=receiverObj)
        friend_request.save()
        
        return Response("Friend request sent.", status.HTTP_200_OK)
    
    def post_response(self, request_data):
        senderObj = Author.objects.get(id=request_data['author']["id"])
        receiverObj = Author.objects.get(id=request_data['friend']["id"])
        accepted = request_data["accepted"]
        
        FriendRequest.objects.filter(sender=senderObj, receiver=receiverObj).delete()
        
        if accepted:
            senderObj.friends.add(receiverObj)
            return Response("Friend added.", status.HTTP_200_OK)
        
        return Response("Friend request declined.", status.HTTP_200_OK)
    
    def unfriend(self, request_data):
        senderObj = Author.objects.get(id=request_data['author']["id"])
        receiverObj = Author.objects.get(id=request_data['friend']["id"])        
        
        if Author.objects.get(id=receiverObj.id).friends.all().filter(id=senderObj.id).exists()==False:
            return Response("Not friends.", status.HTTP_400_BAD_REQUEST)
        
        senderObj.friends.remove(receiverObj)
        return Response("Unfriend done.", status.HTTP_200_OK)
        
    
    def post(self, request):
        if request.data['query'] == 'friendrequest':
            return self.post_request(request.data)
        elif request.data['query'] == 'friendresponse':
            return self.post_response(request.data)
        elif request.data['query'] == 'unfriend':
            return self.unfriend(request.data)
        else:
            return Response("Bad request header.", status.HTTP_400_BAD_REQUEST)

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

class Login(APIView):
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated,)
    """
    POST /login
    Request:
        encoded login (string): base64 encoded username:password
    Response: 
        author (object): author of corresponding user
    """
    def post(self, request):
        if request.user.is_authenticated() is False:
            login(request, request.user)
        author = Author.objects.get(user=request.user)
        serializer = AuthorSerializer(author)
        return Response({'author': serializer.data})
