import uuid
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework.decorators import detail_route
from django.core.exceptions import ObjectDoesNotExist
from .models import *
import json

class NodeSerializer(serializers.ModelSerializer):
    nodeName = serializers.CharField(source='user.username')
    nodePassword = serializers.CharField(source='user.password', write_only=True)

    class Meta:
        mode = Node
        # password is the text form of nodePassword which can only be in hash form.
        fields = ('node_url', 'access_to_posts', 'access_to_images','password', 'user', 'username')

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True
            },
        }

class AuthorInfoSerializer(serializers.ModelSerializer):
    displayName = serializers.SerializerMethodField('get_display')
    first_name = serializers.CharField(source='user.first_name', allow_blank=True, required=False)
    last_name = serializers.CharField(source='user.last_name', allow_blank=True, required=False)
    email = serializers.CharField(source='user.email', allow_blank=True, required=False)
    id = serializers.CharField(required=True)

    class Meta:
        model = Author
        fields = ('id', 'displayName', 'first_name', 'last_name',
                  'email', 'bio', 'host', 'github', 'url')

    def get_display(self, obj):
        return obj.user.username.split("__", 1)[-1]

class ForeignAuthorInfoSerializer(AuthorInfoSerializer):
    id = serializers.CharField(required=True)
    pass


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorInfoSerializer(many=False)
    guid = serializers.CharField(source='id', required=False)
    pubDate = serializers.DateTimeField(source='published', required=False)

    class Meta:
        model = Comment
        fields = ('id', 'guid', 'comment', 'author', 'pubDate', 'published', 'post', 'contentType', 'foreign_post')

    def create(self, validated_data):
        foreign_posts = False
        try: # if posting directly to /post/id/comments, there is id inside the url
            print "GETTING PK FROM REQUEST"
            postId = self.context['request'].parser_context.get('kwargs').get('pk')
        except:
            print "NO PUBLID ID FOUND FOR COMMENTS POST"
            try: # If coming from /foreignposts, there is no id inside pk
                postId = self.context['foreign_id']
                print postId
                foreign_post = True
            except:
                print "NO FOREIGN ID FOR COMMENTS POST"
                return None

        post = None
        foreign_post = None
        try:
            # Case where we are making local post
            post = Post.objects.get(id=postId)
        except:
            try:
                # Case where we are making comments for a foreign post
                print "TRYING TO GET FOREIGN POST FOR COMMENT"
                print postId
                foreign_post = ForeignPost.objects.get(id=postId)
            except:
                print "POST FOR COMMENT NOT FOUND"
                return None

        if foreign_post:
            try: # if coming from /foreignposts, there will be no user inside
                postId = self.context['foreign_id']
                print "Creating post from /foreignposts"
                author = validated_data.pop('author')
                author_url = author.get('url')
                try: # Get author
                    author = Author.objects.get(url=author_url)
                except: # in the case where the author wasn't created because they haven't posted yet
                    user = author.pop('user')
                    author_id = author.pop('id')
                    user = User.objects.create(username=author.get('url') + "__" + user.get('username'))
                    author = Author.objects.create(id=author_id, user=user, **author)
                # make comment
                comment = Comment.objects.create(author=author, foreign_post=foreign_post, **validated_data)
                comment.save()
                return comment
            except:
                print "NOT COMING FROM /foreignposts"
                pass

            print "COMING FROM /POST/ID/COMMENTS"
            author = Author.objects.get(user=self.context.get('request').user)
            comment = Comment.objects.create(author=author, foreign_post=foreign_post, **validated_data)
            comment.save()
            return comment

        print "POSTING LOCAL COMMENT"
        author = Author.objects.get(user=self.context.get('request').user)
        comment = Comment.objects.create(author=author, post=post, **validated_data)
        comment.save()
        return comment

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class ForeignPostSerializer(serializers.ModelSerializer):
    author = ForeignAuthorInfoSerializer(required=True, read_only=False)
    id = serializers.CharField(required=True)
    comments = serializers.SerializerMethodField('getComments')

    class Meta:
        model = ForeignPost
        fields = ('id', 'title', 'source', 'author', 'origin', 'description', 'content',
            'category', 'visibility', 'published','comments', 'contentType')

    def create(self, validated_data):
        # print "CREATING FOREIGN POST..."
        origin = validated_data.get('origin')
        content_type = validated_data.pop('contentType')
        foreign_author = validated_data.pop('author')
        foreign_user = foreign_author.pop('user')

        url = foreign_author.get('url')
        author = None

        postId = validated_data.pop('id')
        try:
            print url
            print foreign_user.get('username')
            author = Author.objects.get(url = url)
        except ObjectDoesNotExist:
            if User.objects.all().filter(username = foreign_author.get('url') + "__" + foreign_user.get('username')).exists():
                User.objects.get(username = foreign_author.get('url') + "__" + foreign_user.get('username')).delete()
            user = User.objects.create(username = foreign_author.get('url') + "__" + foreign_user.get('username'))
            author = Author.objects.create(user = user, **foreign_author)
            user.save()
            author.save()

        if content_type == "type/x-markdown":
            content_type = "type/markdown"

        # print "SAVING FOREIGN POST..."
        try:
            post = ForeignPost.objects.get(id=postId)
        except:
            post = ForeignPost.objects.create(id=postId, author=author, contentType=content_type, **validated_data)
            post.save()

        return post

    # Returns a list of comments
    def getComments(self, obj):
        commentsQuerySet = Comment.objects.all().filter(foreign_post__id=obj.id).order_by('published')[:5]

        serializer = CommentSerializer(commentsQuerySet, many=True)
        return serializer.data

class PostSerializer(serializers.ModelSerializer):

    author = AuthorInfoSerializer(many = False, read_only = True)
    comments = serializers.SerializerMethodField('getComments')

    class Meta:
        model = Post
        fields = ('id', 'title', 'source', 'origin', 'description', 'content',
            'category', 'author', 'visibility', 'published', 'contentType', 'comments')

    def create(self, validated_data):
        id = uuid.uuid4()
        source = validated_data.pop('source')
        if not source:
            source = self.context.get('request').build_absolute_uri() + str(id)
        origin = self.context.get('request').build_absolute_uri() +"/"+ str(id)
        author = Author.objects.get(user=self.context.get('request').user)
        post = Post.objects.create(id=id, origin=origin, source=source, author=author, **validated_data)
        post.save()
        return post

    # Returns a list of comments
    def getComments(self, obj):
        commentsQuerySet = Comment.objects.all().filter(post__id=obj.id).order_by('published')[:5]

        serializer = CommentSerializer(commentsQuerySet, many=True)
        return serializer.data

class ImageSerializer(serializers.ModelSerializer):
    user = AuthorInfoSerializer(many = False, read_only = True)

    class Meta:
        model = Image
        fields = ('id', 'user', 'origin', 'photo')

    def create(self, validated_data):
        id = uuid.uuid4()
        user = Author.objects.get(user=self.context.get('request').user)
        origin = self.context.get('request').build_absolute_uri() + str(id)
        image = Image.objects.create(id=id, user=user, origin=origin, photo=validated_data['photo'])
        image.save()
        return image


class AuthorSerializer(serializers.ModelSerializer):
    """
    Serializer used for doing author profile related operations.
    """
    displayName = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name', allow_blank=True, required=False)
    last_name = serializers.CharField(source='user.last_name', allow_blank=True, required=False)
    email = serializers.CharField(source='user.email', allow_blank=True, required=False)
    password = serializers.CharField(source='user.password', write_only=True)

    friends = AuthorInfoSerializer(many=True, required=False)

    host = serializers.URLField(read_only=True)
    url = serializers.URLField(read_only=True)

    request_sent = AuthorInfoSerializer(source='get_request_sent', many=True, read_only=True)
    request_received = AuthorInfoSerializer(source='get_request_received', many=True, read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)


    class Meta:
        model = Author
        fields = ('id', 'displayName', 'password', 'first_name', 'last_name',
                  'email', 'bio', 'host', 'url', 'github', 'friends', 'request_sent', 'request_received', 'is_active')

    # # Need to be created as User is a nest object of Author.
    # # Returns an author object with user object as an field after extracting data from json.
    def create(self, validated_data):
        id = uuid.uuid4()
        host = "http://"+self.context.get('request').get_host()+"/"
        url = self.context.get('request').build_absolute_uri() + str(id) + '/'
        user_data = validated_data.pop('user')
        user_object = User.objects.create_user(is_active=False, **user_data)
        author = Author.objects.create(id=id, user=user_object, host=host, url=url, **validated_data)
        author.save()
        return author

    # For updating author profile, need extract user form it and handle the nested object as well.
    def update(self, author, validated_data):
        user_data = validated_data.pop('user')
        user = author.user

        user.username=user_data.get('username', user.username)
        user.password=author.user.password
        user.first_name=user_data.get('first_name', user.first_name)
        user.last_name=user_data.get('last_name', user.last_name)
        user.email=user_data.get('email', user.email)
        user.save()

        author.bio = validated_data.get('bio', author.bio)
        author.github = validated_data.get('github', author.github)
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
