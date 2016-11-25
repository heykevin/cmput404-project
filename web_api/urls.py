from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import routers
import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

# adding router for public post
# router.register(r'posts', views.PostView)

urlpatterns = [
    # Examples:
    # url(r'^$', 'c404WebProject.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    # Specific post
    url(r'^', include(router.urls)),
    url(r'^posts/$', views.PostView.as_view()),
    url(r'^posts/(?P<pk>[^/.]+)/comments/$', views.CommentView.as_view()),
    url(r'^posts/(?P<pk>[^/.]+)/$', views.PostIDView.as_view()),
    url(r'^foreignposts/$', views.ForeignPostView.as_view()),

    # Image
    url(r'^images/$', views.ImageView.as_view()),
    url(r'^images/(?P<pk>[^/.]+)/$', views.ImageIDView.as_view()),

    url(r'^author/$', views.AuthorViewSet.as_view()),
    # Get all posts that author can see
    url(r'^author/posts/$', views.AuthorStream.as_view()),
    
    # Images uploaded by currently authenticated author
    url(r'^author/images/$', views.PersonalImagesView.as_view()),

    # Used for updating author profile.
    url(r'^author/(?P<pk>[^/.]+)/$', views.AuthorProfileUpdateView.as_view()),
    # Get all posts you can see from <authorID>
    url(r'^author/(?P<pk>[^/.]+)/posts/$', views.PersonalAuthorStream.as_view()),
    # Posts from specific Author
    # url(r'^author/(?P<pk>[^/.]+)/posts/$', views.SpecificPostView.as_view()),

    # Used for get the list of friends id or check the if an author is a friend of another author.
    url(r'^friends/(?P<pk>[^/.]+)/$', views.FriendsWith.as_view()),
    # Used for check 2 author is friend.
    url(r'^friends/(?P<id1>[^/.]+)/(?P<id2>[^/.]+)/$', views.FriendCheck.as_view()),
    url(r'^login/', views.Login.as_view()),
    # Used for sending friend requests.
    url(r'^friendrequest/$', views.FriendRequestView.as_view()),
    
    url(r'^friendsync/$', views.FriendSyncView.as_view()),
]
