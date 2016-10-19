from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import routers
import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    # Examples:
    # url(r'^$', 'c404WebProject.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    url(r'^', include(router.urls)),
]
