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
from .models import *
from serializers import *


class RemoteConnection:
    
    def check_node_valid(self, request):
        print "\nChecking Node."
        # This first condtion let the test pass as test request don't have this attribute.
        if not 'REMOTE_HOST' in request.META.keys() or request.META['REMOTE_HOST']=='bloggyblog404.herokuapp.com' or request.META['REMOTE_HOST']=='localhost:8080':
            print "Frontend or testing client, OK."
            return True
        
        print "\nRemote node confirmed, checking access permission."
        for node in Node.objects.all():
            print request.user.username
            if "http://"+request.get_host()+"/" == node.node_url and request.user.is_authenticated():
                print "\nAccess permission checking successful."
                return True
        
        print "\nAccess permission checking failed."
        return False
    
    def get_node_auth(self, remote_host):
        
        print "\nGetting auth information from DB."
        for node in Node.objects.all():
            if remote_host == node.node_url:
                return (node.user.username, node.password)
        
        print "\nFailed..."
        return None
    
    def send_to_remote(self, url, data, auth):
        if auth == None:
            print "\nNo auth information."
        print '\nSending request to: '+url
        r = requests.post(url, json=data, auth=auth)
        print '\nGetting ' + str(r.status_code)+' from the remote server.' 
        return r.status_code    