import json
import requests
from requests.auth import HTTPBasicAuth
from django.http import HttpResponse
from django.contrib.auth import login, logout
from django.contrib.auth.models import User, Group
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.authentication import BasicAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import permission_classes, authentication_classes, detail_route
from rest_framework.parsers import JSONParser
from rest_framework import viewsets, generics
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .permissions import *
from .models import Author, Post, Image, ForeignPost
from .remoteConnection import *
from serializers import *
import urlparse

class PostsResultsSetPagination(PageNumberPagination):
    page_size_query_param = 'size'
    page_size = 20

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
    page_size_query_param = 'size'
    page_size = 20

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
        if user.is_staff:
            for node in Node.objects.all():
                if node.user == user:
                    return Post.objects.all().exclude(visibility="SERVERONLY")
            return Post.objects.all()

        # could refactor to use permissions but whatevs
        postsQuerySet = Post.objects.all().filter(visibility="PUBLIC")
        ownQuerySet = Post.objects.all().filter(author__user=user).exclude(visibility="PUBLIC")
        privateQuerySet = Post.objects.all().filter(visibility="PRIVATE").filter(author__user=user)
        querySet = postsQuerySet | privateQuerySet | ownQuerySet
        # get friends and foaf posts
        for friend in Author.objects.get(user=user).friends.all():
            friendQuerySet = Post.objects.all().filter(author=friend).filter(visibility="FRIENDS")
            friendFoafQuerySet = Post.objects.all().filter(author=friend).filter(visibility="FOAF")
            serverQuerySet = Post.objects.all().filter(author=friend).filter(visibility="SERVERONLY")
            querySet = querySet | friendQuerySet | serverQuerySet | friendFoafQuerySet
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

        #if admin show everything
        if (self.request.user.is_staff and not self.request.user == author.user):
            return authorPosts.exclude(visibility="PRIVATE")


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
        github (string)
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
        github (string)
        friends (list)
    Response:
        displayname (string)
        password (string)
        first_name (string)
        password (string)
        email (string)
        bio (string)
        host (string)
        github (string)
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
        github (string)
        friends (list)
    Response (author object):
        displayname (string)
        password (string)
        first_name (string)
        password (string)
        email (string)
        bio (string)
        host (string)
        github (string)
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

'''
A viewset for service/foreignposts/
public posts from foreign nodes

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
class ForeignPostView(generics.ListAPIView):
    authentication_classes = (BasicAuthentication, )
    permission_classes = (IsAuthenticated, )
    queryset = ForeignPost.objects.all()
    serializer_class = ForeignPostSerializer

    rc = RemoteConnection()
    def createForeignPosts(self, request):
        res = []
        for node in Node.objects.all():
            try:
                r = self.rc.get_from_remote(node.node_url+"author/posts?size=1000/", auth = self.rc.get_node_auth(node.node_url))
                # print 'testing:' + r.text
                print json.loads(r.text)
            except:
                continue
            try:
                if 'posts' in json.loads(r.text):
                    print "POSTS"
                    serializer = ForeignPostSerializer(data=json.loads(r.text).get('posts'), many=True)

                    if serializer.is_valid():
                        serializer.save()
                        res.extend(serializer.data)

                for post in json.loads(r.text).get('posts'):
                    if post.get('comments'):
                        print "WORKING ON POST ----------------"
                        print post.get('id')
                        print post.get('title')
                        comment_serializer = CommentSerializer(data=post.get('comments'), context={'foreign_id': post.get('id')}, many=True)
                        if comment_serializer.is_valid():
                            comment_serializer.save()

                    else:
                        print "SAVING FOREIGN POSTS FAILED IN VIEWS"
                        print serializer.errors
                        res.extend(serializer.errors)
            except:
                return

    def createFriendRequest(self, authorId, friends):
        req = dict()
        req['author'] = str(authorId)
        req['authors'] = friends
        req['query'] = 'friends'
        return req


    def get(self, request, format=None):
        source = "http://" + self.request.get_host() + "/"
        user = self.request.user
        author = Author.objects.get(user=user)
        # Delete everything.
        ForeignPost.objects.all().delete()
        # Get and create remote public posts
        self.createForeignPosts(request)
        queryset = ForeignPost.objects.all()
        pubqueryset = queryset.filter(visibility="PUBLIC")
        # Get a list of remote friends for FOAF
        friends = []

        # query set of foaf but NOT friends
        notfriend_foaf_queryset = ForeignPost.objects.none()
        # Get friend posts
        for friend in Author.objects.get(user=user).friends.all():
            if not friend.host[-1] == "/":
                friend.host = friend.host + "/"
            friends.append(str(friend.id))
            # If friend is not local
            if not friend.host == source:
                # Put friend in remote_friends to be later used for FOAF
                friend_node = Node.objects.get(node_url = friend.host)
                url = "%sfriends/%s/%s/" % (friend_node.node_url, author.id, friend.id)
                # check node's server if currently friends
                r = self.rc.get_from_remote(url, auth = self.rc.get_node_auth(friend_node.node_url))
                response = json.loads(r.text)
                # if currently friends
                if json.loads(r.text).get('friends'):
                    friend_queryset = queryset.filter(author=friend)
                    friend_only_queryset = friend_queryset.filter(visibility="FRIENDS")
                    friend_foaf_queryset = friend_queryset.filter(visibility="FOAF")
                    notfriend_foaf_queryset = notfriend_foaf_queryset | queryset.filter(visibility="FOAF").exclude(author=friend)
                    pubqueryset = pubqueryset | friend_only_queryset | friend_foaf_queryset

        # authors who are foaf
        foaf = []
        for post in notfriend_foaf_queryset:
            # POST list of friends
            authorId = post.author.id
            author_host =  post.author.host

            if not author_host[-1] == "/":
                author_host = author_host + "/"

            try:
                author_node = Node.objects.get(node_url = author_host)
            except:
                print "Remote author node not found"
            url = "%sfriends/%s/" % (author_node.node_url, authorId)
            print url
            data = self.createFriendRequest(authorId, friends)

            # send a list of my friends to author
            r = self.rc.post_to_remote(url, data, self.rc.get_node_auth(author_node.node_url))

            # get list of friends that they have in common
            true_friends = json.loads(r.text).get("authors")

            # if any friends are the same, add post
            if len(true_friends) > 0:
                pubqueryset = pubqueryset | notfriend_foaf_queryset.filter(id=post.id)

        serializer = ForeignPostSerializer(pubqueryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_queryset(self):
        return ForeignPost.objects.all()



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
            if not queryset.author.friends.all().get(user=request.user) and not (queryset.author.user==request.user):
                return Response("The post id does not exist", status=status.HTTP_400_BAD_REQUEST)

        if queryset.visibility == "PRIVATE":
            if not (queryset.author.user==request.user):
                return Response("The post id does not exist", status=status.HTTP_400_BAD_REQUEST)
        print "GETTING ID POST"
        serializer = PostSerializer(queryset)
        res = dict()
        res["posts"] = serializer.data
        res["count"] = 1
        res["size"] = 10
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

    rc = RemoteConnection()

    def get_queryset(self):
        postID = self.request.parser_context.get('kwargs').get('pk')
        queryset = Comment.objects.all().filter(post=postID)
        return queryset

    def post(self, request, pk):
        post = None
        foreignpost = None
        try: #look for local post
            post = Post.objects.get(id=pk)
        except: # else look for remote post
            try:
                foreignpost = ForeignPost.objects.get(id=pk)
            except:
                # Post doesn't exist
                return Response("Post doesn't exist'", status=status.HTTP_404_NOT_FOUND)

        if (foreignpost): # if post is foreign
            print "HEY FOREIGN POSTS"
            remote_host = self.rc.makesure_host_with_slash(foreignpost.author.host)
            url = "%sposts/%s/comments/" % (remote_host, foreignpost.id)
            # try:
            r = self.rc.post_to_remote(url, request.data, self.rc.get_node_auth(remote_host))
            print r.text
            return Response(r.text, status=status.HTTP_404_NOT_FOUND)
            # except:
            #     print r.text
            #     return Response("Sending comment to remote post failed", status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        data = request.data
        comment_data = request.data.pop("comment")
        data_author = comment_data.pop("author")

        print data
        print data_author
        source = "http://" + self.request.get_host() + "/"
        author_host = data_author.get("host")
        author_id = data_author.get("id")
        post_url = request.data.pop("post")
        if not author_host[-1] == "/":
            author_host = author_host + "/"
        # this is for local posts
        # Check if user is local
        print source
        print author_host
        print source == author_host
        if (source == author_host):
            # user is local
            print "LOCAL COMMENT AT " + source
            author = Author.objects.get(user=user)
            print request.data
            try:
                id = comment_data.pop('id')
            except:
                try:
                    id = comment_data.pop('guid')
                except:
                    Response("No Id found", status=status.HTTP_400_BAD_REQUEST)

            comment = Comment.objects.create(id=id, author=author, post=post, **comment_data)
        else: # make sure author is from a node
            try:
                author_node = Node.objects.get(node_url = author_host)
            except:
                return Response("Author not from approved node", status=status.HTTP_400_BAD_REQUEST)
            try:
                author = Author.objects.get(id=author_id)
            except: # author not yet in database so we should create them
                print "NOT AUTHOR"
                user = User.objects.create(username = author_host[0:-1] + "__" + data_author.pop("displayName"))
                try:
                    data_author.pop('url')
                except:
                    pass
                author = Author.objects.create(user=user, url=author_host+"author/"+author_id+"/", **data_author)
            try:
                id = comment_data.pop('id')
            except:
                try:
                    id = comment_data.pop('guid')
                except:
                    Response("No Id found", status=status.HTTP_400_BAD_REQUEST)
            comment = Comment.objects.create(author=author, id=id, post=post, **comment_data)

        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def __unicode__(self):
        return "Parent post:"+ str(self.parent_post.id) + ", Author:" + self.author.displayName + ": " + self.content

class FriendsWith(APIView):
    """
    GET /friends/<authorID>
    Response:
        authors (list): containing friend list of author
    """
    def get(self, request, pk, format=None):
        sf = SyncFriend()
        sf.syncfriend(request)

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
        sf = SyncFriend()
        sf.syncfriend(request)

        if request.data['query'] != 'friends':
            return Response("Incorrect request field: 'query' field should be 'friends'.", status.HTTP_400_BAD_REQUEST)

        friend_queryset = Author.objects.get(id=request.data['author']).friends.all()
        request_list = request.data['authors']
        match_list = []
        for friend in request_list:
            if friend_queryset.filter(id=friend).exists():
                match_list.append(str(friend))

        res = dict()
        res['authors'] = match_list
        res['author'] = request.data['author']
        res['query'] = 'friends'
        return Response(res)

class FriendRequestView(APIView):

    def get_author_info(self, request, key_name):
        res=dict()
        node = self.rc.sync_hostname_if_local(request.data[key_name]["host"])
        author_id = request.data[key_name]["id"]

        if(node == self.myNode or node == self.myNode2):
            res["obj"] = Author.objects.get(id = author_id)
            res["is_local"] = True
        else:
            if Author.objects.filter(id = author_id).exists():
                res["obj"] = Author.objects.get(id = author_id)
            else:
                foreign_user=User(username = request.data[key_name]["host"] + "__" + request.data[key_name]["displayName"], is_active=False)
                foreign_user.save()

                url = node
                if node[-1] != '/':
                    url += '/'

                url += (str(author_id)+'/')

                res["obj"] = Author(user=foreign_user, id=request.data[key_name]["id"], host = node, url = url)
                res["obj"].save()
            res["is_local"] = False
        return res

    # May need to use this !
    '''
    def check_empty_foreign_record(self, foreign_author):
        if foreign_author.friends.all().count()==0 and len(foreign_author.get_request_sent())==0 and len(foreign_author.get_request_received())==0:
            foreign_author.user.delete()
    '''

    # Handles the request creation
    def post_request(self, request):
        sender = self.get_author_info(request, 'friend')
        receiver = self.get_author_info(request, 'author')

        if (not sender["is_local"]) and (not receiver["is_local"]):
            return Response("Neither author is local on this server.", status.HTTP_400_BAD_REQUEST)

        if receiver["obj"].friends.all().filter(id=sender["obj"].id).exists():
            return Response("Already friends.", status.HTTP_200_OK)

        if sender["obj"] in receiver["obj"].get_request_received():
            return Response("Friend request already sent.", status.HTTP_200_OK)

        # If sender already send a request then just add friend.
        # Add friend first, if not getting 200 is only their bad.
        if receiver["obj"] in sender["obj"].get_request_received():
            sender['obj'].friends.add(receiver['obj'])
            FriendRequest.objects.filter(sender=receiver['obj'], receiver=sender['obj']).delete()

            return Response("Friend added.", status.HTTP_200_OK)

        # This is the communicating process to other nodes.
        if (sender["is_local"]) and (not receiver["is_local"]):
            remote_host = self.rc.makesure_host_with_slash(receiver["obj"].host)
            url = remote_host+'friendrequest/'

            r = self.rc.post_to_remote(url, request.data, self.rc.get_node_auth(remote_host))

            if r.status_code != 200 and r.status_code != 201:
                return Response("Not getting 200 or 201 from the remote.", status.HTTP_400_BAD_REQUEST)
        # -------------------------------------------------

        # Otherwise get the request object created.
        friend_request = FriendRequest.objects.create(sender=sender["obj"], receiver=receiver["obj"])
        friend_request.save()
        return Response("Friend request sent.", status.HTTP_200_OK)

    def reject_request(self, request):
        senderObj = Author.objects.get(id=request.data["friend"]["id"])
        receiverObj = Author.objects.get(id=request.data["author"]["id"])

        FriendRequest.objects.filter(sender=senderObj, receiver=receiverObj).delete()
        return Response("Friend request rejected.", status.HTTP_200_OK)

    def unfriend(self, request):
        senderObj = Author.objects.get(id=request.data["friend"]["id"])
        receiverObj = Author.objects.get(id=request.data["author"]["id"])

        senderObj.friends.remove(receiverObj)

        # print receiverObj.host, senderObj.host, self.myNode
        '''
        if receiverObj.host != self.myNode and receiverObj.host != self.myNode2:
            self.check_empty_foreign_record(receiverObj)
        if senderObj.host != self.myNode and senderObj.host != self.myNode2:
            self.check_empty_foreign_record(senderObj)
        '''

        return Response("Unfriend done.", status.HTTP_200_OK)


    def post(self, request):
        self.rc = RemoteConnection()
        # With or withour slash.
        self.myNode = self.rc.sync_hostname_if_local('http://'+request.get_host()+'/')
        self.myNode2 = self.rc.sync_hostname_if_local('http://'+request.get_host())

        sf = SyncFriend()
        sf.syncfriend(request)

        if not self.rc.check_node_valid(request):
            return Response("What's this node?", status.HTTP_401_UNAUTHORIZED)

        if request.data['query'] == 'friendrequest':
            return self.post_request(request)

        if request.data['query'] == 'rejectrequest':
            return self.reject_request(request)

        elif request.data['query'] == 'unfriend':
            return self.unfriend(request)

        else:
            return Response("Bad request header.", status.HTTP_400_BAD_REQUEST)

class FriendSyncView(APIView):

    def get(self, request):
        sf = SyncFriend()
        return sf.syncfriend(request, is_from_client=True)


class FriendCheck(APIView):
    """
    GET /friends/<authorID1>/<authorID2>
    Response:
        query (string): "friends"
        authors (string): ids of checked authors
        friends (bool): true iff friends
    """

    rc = RemoteConnection()


    def get(self, request, id1, id2, format=None):
        # sf = SyncFriend()
        # sf.syncfriend(request)

        res = dict()
        res['authors'] = [id1, id2]
        res['query'] = "friends"
        try:
            queryset1 = Author.objects.get(id=id1)
            queryset2 = Author.objects.get(id=id2)
        except Author.DoesNotExist:
            res['friends'] = False
            return Response(res)

        list1 = [str(id['id']) for id in queryset1.friends.all().values('id')]
        list2 = [str(id['id']) for id in queryset2.friends.all().values('id')]
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
