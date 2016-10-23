from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token
import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'author', views.AuthorViewSet)

# adding router for public post
router.register(r'posts', views.PostViewSet)

urlpatterns = [
    # Examples:
    # url(r'^$', 'c404WebProject.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    url(r'^', include(router.urls)),
    # specific post
    url(r'^posts/(?P<pk>[^/.]+)/comments/$', views.CommentView.as_view()),
    url(r'^friends/(?P<pk>[^/.]+)/$', views.FriendsWith.as_view()),                      # Used for get the list of friends id or check the if an author is a friend of another author.
    url(r'^friends/(?P<id1>[^/.]+)/(?P<id2>[^/.]+)/$', views.FriendCheck.as_view()),     # Used for check 2 author is friend.
    
    # /login/ endpoint using the Rest Framework JWT library view
    # Request:
    #     username (string): username of account
    #     password (string): password of account
    # Response:
    #     token (63 bit encoded string)
    #     author object of current user
    url(r'^login/', obtain_jwt_token),
]
