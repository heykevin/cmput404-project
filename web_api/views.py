from django.http import HttpResponse
from django.contrib.auth import login, logout
from django.contrib.auth.models import User, Group
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import JSONParser
from rest_framework import viewsets, generics
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from .models import Author, Post
from serializers import *
import json

class PostsResultsSetPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            "size": self.page_size,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'posts': data
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
    
class AuthorProfileUpdateView(APIView):
    serializer_class = AuthorSerializer
    
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
    Response:
        "Author profile updated."
    '''
    def put(self, request, pk):
        authorObj = Author.objects.get(id=pk)
        serializer = AuthorSerializer(authorObj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''   
class PostView(APIView):
    
    def get(self, request, pk, format=None):
        queryset = Post.objects.get(id=pk)
        serializer = PostSerializer(queryset)
        return Response(serializer.data)
'''

class PostView(APIView):
    # shows all authors post lists
    #
    # GET /posts
    # #

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # serializer = PostSerializer(queryset)

    # get specific post from an author
    #
    # GET /posts/<postID>
    #
    def get(self, request, format=None):
        queryset = Post.objects.all()
        serializer = PostSerializer(queryset, many=True)
        res = dict()
        res["count"] = Post.objects.count()
        res["posts"] = serializer.data
        return Response(res)

    # POST post by an author
    #
    # POST
    #
    def post(self,request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    '''
    Note to self, to do
    '''
    def delete(self, request, pk, format=None):
        # find the query set
        queryset = Post.objects.get(id=pk)
        serializer = PostSerializer(queryset)
        serializer.delete()
        return Response("post has been deleted", status=status.HTTP_204_NO_CONTENT)
    # POST post by an author
    #
    # POST
    #
    def post(self,request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    '''
    Note to self, to do
    '''
    def delete(self, request, pk, format=None):
        # find the query set
        queryset = Post.objects.get(id=pk)
        serializer = PostSerializer(queryset)
        serializer.delete()
        return Response("post has been deleted", status=status.HTTP_204_NO_CONTENT)

# A viewset for
# service/author/author_id/post
class SpecificPostView(APIView):

    # get posts from specific author

    def get(self, request, pk, format=None):
        author = Author.objects.get(id=pk)
        if Post.objects.filter(author_id=author).exists():
            queryset = Post.objects.filter(author_id=author)
            serializer = PostSerializer(queryset, many=True)
            res = dict()
            res["count"] = Post.objects.count()
            res["posts"] = serializer.data
            return Response(res, status=status.HTTP_200_OK)
        return Response("Author has no post", status=status.HTTP_400_BAD_REQUEST)

class PostIDView(APIView):

    def get(self, request, pk, format=None):
        if Post.objects.filter(id=pk).exists():
            queryset = Post.objects.filter(id=pk)
            serializer = PostSerializer(queryset, many=True)
            res = dict()
            res["posts"] = serializer.data
            return Response(res, status=status.HTTP_200_OK)
        return Response("The post id does not exist", status=status.HTTP_400_BAD_REQUEST)
        
class CommentView(APIView):

    # GET comment from specific post_id

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
    
    def check_friend_request_staus(self, request_data):
        authorObj = Author.objects.get(id=request_data['author']["id"])
        
        res = dict()
        res["sent to"] = []
        res["recv from"] = []
        
        
        for object in FriendRequest.objects.filter(sender=authorObj):
            res["sent to"].append(AuthorSerializer(object.receiver).data)
        
        for object in FriendRequest.objects.filter(receiver=authorObj):
            res["recv from"].append(AuthorSerializer(object.sender).data)
        
        return Response(res, status.HTTP_200_OK)
    
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
        elif request.data['query'] == 'friendrequeststatus':
            return self.check_friend_request_staus(request.data)
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
