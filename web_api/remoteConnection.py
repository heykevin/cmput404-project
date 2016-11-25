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
    
    def makesure_host_with_slash(self, host):
        if host[-1]!='/':
            host+='/'
        return host
    
    def sync_hostname_if_local(self, host):
        splitted = host.split(":")
        if splitted[1] == '//localhost':
            sync_host = splitted[0] +'://127.0.0.1:' + splitted[2]
            return sync_host
        else:
            return host
    
    def check_node_valid(self, request):
        print "Checking the reuqest sender host..."
        
        # for key,val in request.META.items():
            # print key, val
        
        if request.META['REMOTE_ADDR'] == '127.0.0.1':
            print "\nLocalhost found, assuming you are sending request from local."
            return True
        
        if request.META['REMOTE_HOST'].isspace():
            print "\nRemote host field found empty...Error"
            return False
        
        print "\nRequest from host: "+request.META['REMOTE_HOST']
        
        # Client case.
        if request.META['REMOTE_HOST']=='bloggyblog404.herokuapp.com':
            print "\nFrontend url confirmed, OK."
            return True
        
        print "\nRemote node confirmed, checking access permission."
        
        for node in Node.objects.all():
            # print request.user.username
            if "http://"+request.META['REMOTE_HOST']+"/" == node.node_url and request.user.is_authenticated():
                print "\nAccess permission checking successful."
                return True
        
        print "\nRemote node access permission checking failed."
        return False
    
    def get_node_auth(self, remote_host):
        
        print "\nGetting auth information from DB."
        for node in Node.objects.all():
            if remote_host == node.node_url:
                return (node.user.username, node.password)
        
        print "\nFailed..."
        return None
    
    def post_to_remote(self, url, data, auth):
        print '\nSending post request to: '+url
        r = None
        
        if auth == None:
            print "\nNo auth information."
            r = requests.post(url, json=data)
        else:
            print "\nSever access auth: {" + auth[0] + " : " + auth[1] + "}"
            r = requests.post(url, json=data, auth=auth)
        
        print '\nGetting ' + str(r.status_code)+' from the remote server.'
        return r
    
    def get_from_remote(self, url, auth):
        print '\nSending get request to: '+url
        r=None
        
        if auth == None:
            print "\nNo auth information."
            r = requests.get(url)
        else:
            r = requests.get(url, auth=auth)
        
        print '\nGetting ' + str(r.status_code)+' from the remote server.'       
        return r


class SyncFriend:
    
    rc = RemoteConnection()
    
    def syncfriend(self, request, is_from_client = False):
        for local_author in Author.objects.filter(host = 'http://'+request.get_host()+'/'):
            for friend in local_author.friends.all():
                if friend.host != 'http://'+request.get_host()+'/' and friend.host != 'http://'+request.get_host():
                    self.check_remote_friend_list(str(local_author.id), str(friend.id), friend.host)
        if is_from_client:        
            return Response("Sync done.", status.HTTP_200_OK)
        else:
            return None
    
    def check_remote_friend_list(self, local_author_id, remote_friend_id, remote_host):
        print "Checking remote friend list..."
        r = self.rc.get_from_remote(remote_host+"friends/"+local_author_id+'/'+remote_friend_id+'/', self.rc.get_node_auth(remote_host))
        is_friend = json.loads(r.text).get('friends')
                        
        if not is_friend:
            print "Author which no longer be friend found, removing from list..."
            Author.objects.get(id = local_author_id).friends.remove(Author.objects.get(id = remote_friend_id)) 