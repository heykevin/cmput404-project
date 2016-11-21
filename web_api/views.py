from django.http import HttpResponse
from django.contrib.auth import login, logout
from django.contrib.auth.models import User, Group
from django.conf import settings
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
from django.shortcuts import get_object_or_404
from .permissions import IsAuthorOrReadOnly, IsPostAuthorOrReadOnly
from .models import Author, Post, Image
from serializers import *
import json
import requests

class PostsResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            "query": "posts",
            "count": self.page.paginator.count,
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
            "count": self.page.paginator.count,
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
        ownQuerySet = Post.objects.all().filter(author__user=user).exclude(visibility="PUBLIC")
        privateQuerySet = Post.objects.all().filter(visibility="PRIVATE").filter(author__user=user)
        querySet = postsQuerySet | privateQuerySet | ownQuerySet

        # get friends and foaf posts
        for friend in Author.objects.get(user=user).friends.all():
            friendQuerySet = Post.objects.all().filter(author=friend).filter(visibility="FRIENDS")
            serverQuerySet = Post.objects.all().filter(author=friend).filter(visibility="SERVERONLY")
            querySet = querySet | friendQuerySet | serverQuerySet
            for foaf in friend.friends.all():
                foafQuerySet = Post.objects.all().filter(author=foaf).filter(visibility="FOAF")
                querySet = querySet | foafQuerySet

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
        privatePosts = authorPosts.all().filter(visibility="PRIVATE").filter(author__user=user)
        querySet = publicPosts | privatePosts
        if (Author.objects.get(user=user) in author.friends.all().filter(user=user) or Author.objects.get(user=user) == author):
            friendQuerySet = authorPosts.filter(visibility="FRIENDS")
            serverQuerySet = authorPosts.filter(visibility="SERVERONLY")
            querySet = querySet | friendQuerySet | serverQuerySet

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
        # queryset = Author.objects.all().filter(host="http://"+request.get_host()+"/")
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
        serializer = AuthorSerializer(data=request.data, context={'request': request})
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

class PostView(generics.ListCreateAPIView):
    '''
    A viewset for service/posts/
    public posts are shown by get_queryset as default

    response(post_object)
        'id': UUID
        'title': string
        'source': URL
        'origin': URL
        'description': string
        'content': string
        'category': string
        'visibility': choice selection
        'content type': choice selection
    '''
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostsResultsSetPagination
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        return Post.objects.all().filter(visibility="PUBLIC")

    def post(self,request):
        '''
        POST method for post
        requires(post_object)
            'id': UUID
            'title': string
            'source': URL
            'origin': URL
            'description': string
            'content': string
            'category': string
            'visibility': choice selection
            'content type': choice selection

        responses are the same
        '''
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostIDView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsPostAuthorOrReadOnly, )
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    '''
    APIView for service/posts/<post_id>/

    response(post_object)
        'id': UUID
        'title': string
        'source': URL
        'origin': URL
        'description': string
        'content': string
        'category': string
        'visibility': choice selection
        'content type': choice selection
    '''
    def get(self, request, pk, format=None):
        queryset = get_object_or_404(Post,id=pk)
        # TODO: Refactor this gross code
        if queryset.visibility == "FRIENDS":
            # print queryset.author.friends.all()
            if queryset.author.friends.all().get(user=request.user):
                pass
            else:
                return Response("The post id does not exist", status=status.HTTP_400_BAD_REQUEST)

        if queryset.visibility == "PRIVATE":
            if (queryset.author.user==request.user):
                pass
            else:
                return Response("The post id does not exist", status=status.HTTP_400_BAD_REQUEST)

        serializer = PostSerializer(queryset)
        res = dict()
        res["posts"] = serializer.data
        return Response(res, status=status.HTTP_200_OK)

class ImageView(generics.ListCreateAPIView):
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated, )
    serializer_class = ImageSerializer
    '''
    APIView for service/images/

    response(image_object)
        'id': UUID
        'user': author
        'photo': imagefile
        'origin': origin
    '''

    def get_queryset(self):
        return Image.objects.all()

    def post(self, request):
        '''
        POST method for images
        requires(post_object)
            'id': UUID
            'user': author
            'photo': imagefile
        '''
        serializer = ImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImageIDView(generics.CreateAPIView):
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated, )
    serializer_class = ImageSerializer

    def get(self, request, pk, format=None):
        queryset = get_object_or_404(Image, id=pk)
        serializer = ImageSerializer(queryset)
        image = serializer.data['photo']
        contenttype = image.split('.')[-1]
        with open(settings.MEDIA_ROOT + '/' + image, "rb") as file:
            return HttpResponse(file.read(), content_type="image/" + contenttype)

class PersonalImagesView(generics.ListAPIView):
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated, )
    serializer_class = ImageSerializer

    def get_queryset(self):
        return Image.objects.all().filter(user__user=self.request.user)


class CommentView(generics.ListCreateAPIView):
    '''
    List API view for comment
    GET /posts/<post_id>/comments
    response
        id (UUID)
        content (string)
        author (object)
        publishtime
        post(UUID)

    POST /posts/<post_id>/comments
        request
            content(string)
        response
            id (UUID)
            content (string)
            author (object)
            publishtime
            post(UUID)
    '''
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated, )
    pagination_class = CommentResultsSetPagination

    def get_queryset(self):
        postID = self.request.parser_context.get('kwargs').get('pk')
        queryset = Comment.objects.all().filter(post=postID)
        return queryset

    def post(self, request, pk):
        post = Post.objects.get(id=pk)
        author = Author.objects.get(user=request.user)
        try:
            comment = Comment.objects.create(author=author,post=post, **request.data)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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

    def get_author_info(self, request, key_name):
        res=dict()
        node = request.data[key_name]["host"]
        # print node
        if(node == 'http://'+request.get_host()+'/' or node == 'http://'+request.get_host()):
            res["obj"] = Author.objects.get(id=request.data[key_name]["id"])
            res["is_local"] = True
        else:
            if Author.objects.filter(id=request.data[key_name]["id"]).exists():
                res["obj"] = Author.objects.get(id=request.data[key_name]["id"])
            else:
                foreign_user=User(username=request.data[key_name]["displayName"], is_active=False)
                foreign_user.save()
                res["obj"] = Author(user=foreign_user, id=request.data[key_name]["id"], host = node)
                res["obj"].save()
            res["is_local"] = False
        return res

    def check_empty_foreign_record(self, foreign_author):
        if foreign_author.friends.all().count()==0 and len(foreign_author.get_request_sent())==0 and len(foreign_author.get_request_received())==0:
            foreign_author.delete()


    def talk_to_nodes_then_check_if_need_delete(self, senderObj, receiverObj):
        if (receiverObj.host == self.myNode or receiverObj.host == self.myNode2) and (senderObj.host != self.myNode and senderObj.host != self.myNode2):
            # TODO send to other server in case of response
            self.check_empty_foreign_record(senderObj)

        elif (senderObj.host == self.myNode or senderObj.host == self.myNode2) and receiverObj.host != self.myNode and receiverObj.host != self.myNode2:
            # TODO send to other server in case of unfriend
            self.check_empty_foreign_record(receiverObj)

        # May be you should modify this to return response?


    # Handles the request creation
    def post_request(self, request):
        sender = self.get_author_info(request, 'author')
        receiver = self.get_author_info(request, 'friend')

        if (not sender["is_local"]) and (not receiver["is_local"]):
            return Response("Who are they?", status.HTTP_400_BAD_REQUEST)

        if sender["is_local"]:
            if sender["obj"].friends.all().filter(id=receiver["obj"].id).exists():
                return Response("Already friends.", status.HTTP_400_BAD_REQUEST)
            if receiver["obj"] in sender["obj"].get_request_sent():
                return Response("Friend request already sent.", status.HTTP_400_BAD_REQUEST)
            if receiver["obj"] in sender["obj"].get_request_received():
                return Response("Friend request sent by receiver.", status.HTTP_400_BAD_REQUEST)
            # This is the communicating process to other nodes.
            if not receiver["is_local"]:
                remote_host = receiver["obj"].host
                if remote_host[-1] != '/':
                    remote_host+='/'
                r = requests.post(remote_host, data=request.data)
                if r.status_code != 200 and r.status_code != 201:
                    return Response("Maybe the remote server crashed.", status.HTTP_400_BAD_REQUEST)
            # -------------------------------------------------

        elif receiver["is_local"]:
            if receiver["obj"].friends.all().filter(id=sender["obj"].id).exists():
                return Response("Already friends.", status.HTTP_400_BAD_REQUEST)
            if sender["obj"] in receiver["obj"].get_request_sent():
                return Response("Friend request already sent.", status.HTTP_400_BAD_REQUEST)
            if sender["obj"] in receiver["obj"].get_request_received():
                return Response("Friend request sent by receiver.", status.HTTP_400_BAD_REQUEST)

        friend_request = FriendRequest.objects.create(sender=sender["obj"], receiver=receiver["obj"])
        friend_request.save()

        return Response("Friend request sent.", status.HTTP_200_OK)

    # In this function, receiver is the response sender! REVERSE!
    def post_response(self, request):
        senderObj = Author.objects.get(id=request.data['author']["id"])
        receiverObj = Author.objects.get(id=request.data['friend']["id"])
        accepted = request.data["accepted"]

        FriendRequest.objects.filter(sender=senderObj, receiver=receiverObj).delete()

        if accepted:
            senderObj.friends.add(receiverObj)
            return Response("Friend added.", status.HTTP_200_OK)
        else:
            self.talk_to_nodes_then_check_if_need_delete(senderObj, receiverObj)

        return Response("Friend request declined.", status.HTTP_200_OK)

    def unfriend(self, request):
        senderObj = Author.objects.get(id=request.data["author"]["id"])
        receiverObj = Author.objects.get(id=request.data["friend"]["id"])

        senderObj.friends.remove(receiverObj)

        self.talk_to_nodes_then_check_if_need_delete(senderObj, receiverObj)

        return Response("Unfriend done.", status.HTTP_200_OK)


    def post(self, request):
        # With or withour slash.
        self.myNode = 'http://'+request.get_host()+'/'
        self.myNode2 = 'http://'+request.get_host()

        if request.data['query'] == 'friendrequest':
            return self.post_request(request)
        elif request.data['query'] == 'friendresponse':
            return self.post_response(request)
        elif request.data['query'] == 'unfriend':
            return self.unfriend(request)
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
