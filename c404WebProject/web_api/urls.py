from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import routers
import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'author', views.AuthorViewSet)

urlpatterns = [
    # Examples:
    # url(r'^$', 'c404WebProject.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    url(r'^', include(router.urls)),
    
    url(r'^posts/(?P<pk>[^/.]+)/$',views.PostView.as_view()),
    url(r'^posts/(?P<pk>[^/.]+)/comments/$', views.CommentView.as_view()),
    url(r'^friends/(?P<pk>[^/.]+)/$', views.FriendsWith.as_view()),
    url(r'^friends/(?P<id1>[^/.]+)/(?P<id2>[^/.]+)/$', views.FriendCheck.as_view()),
]
