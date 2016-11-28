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
    
    def check_url_slash(self, url):
        if 'http://secure-springs-85403.herokuapp.com/' in str(url) or 'http://socialnets404.herokuapp.com/' in str(url):
            return str(url)[:-1]
        return url        
    
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
        print "Checking the request sender host..."
        
        # for key,val in request.META.items():
            # print key, val
        
        if request.META['REMOTE_ADDR'] == '127.0.0.1':
            print "\nLocalhost found, assuming you are sending request from local."
            return True
        
        if 'HTTP_ORIGIN' in request.META.keys():
            if request.META['HTTP_ORIGIN'] == 'http://bloggyblog404.herokuapp.com' or request.META['HTTP_ORIGIN'] == 'https://bloggyblog404.herokuapp.com':
                print "Request from our own client, OK."
                return True
        
        print "\nRequest from remote host, checking auth information."
        
        # Client case.
        
        print "\nRemote node confirmed, checking access permission."
        
        for node in Node.objects.all():
            if node.user == request.user and request.user.is_authenticated():
                print "\nAccess permission checking successful."
                return True
        
        print "\nRemote node access permission checking failed."
        return True
    
    def get_node_auth(self, remote_host):
        
        print "\nGetting auth information from DB for %s" % remote_host
        for node in Node.objects.all():
            print "Checking " + node.node_url
            if remote_host == node.node_url:
                return (node.username, node.password)
        
        print "\nFailed..."
        return None
    
    def post_to_remote(self, url, data, auth):
        print '\nSending post request to: ' + self.check_url_slash(url)
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
        print '\nSending get request to: ' + self.check_url_slash(url)
        r=None
        
        if auth == None:
            print "\nNo auth information."
            r = requests.get(self.check_url_slash(url))
        else:
            r = requests.get(self.check_url_slash(url), auth=auth)
        
        print '\nGetting ' + str(r.status_code)+' from the remote server.'       
        return r


class SyncFriend:
    
    rc = RemoteConnection()
    
    def syncfriend(self, request, is_from_client = False):
        for local_author in Author.objects.filter(host = 'http://'+request.get_host()+'/'):
            
            for friend in local_author.friends.all():
                if friend.host != 'http://'+request.get_host()+'/' and friend.host != 'http://'+request.get_host():
                    self.sync_removed_friends(str(local_author.id), str(friend.id), self.rc.makesure_host_with_slash(friend.host))
            
            for pending_friend in local_author.get_request_sent():
                if pending_friend.host != 'http://'+request.get_host()+'/' and pending_friend.host != 'http://'+request.get_host():
                    self.sync_pending_friends(str(local_author.id), str(pending_friend.id), self.rc.makesure_host_with_slash(pending_friend.host))              
        
        if is_from_client:        
            return Response("Sync done.", status.HTTP_200_OK)
        else:
            return None
    
    def sync_pending_friends(self, local_author_id, remote_pending_friend_id, remote_host):
        print "Checking remote friend list with removed friends..."
        
        final_url = remote_host+"friends/"+local_author_id+'/'+remote_pending_friend_id+'/'     
        
        r = self.rc.get_from_remote(final_url, self.rc.get_node_auth(remote_host))
        is_friend = json.loads(r.text).get('friends')
        
                            
        if is_friend:
            print "Author already being friend found, removing from pending list and adding friend..."
            author = Author.objects.get(id = local_author_id)
            remote_pending_friend = Author.objects.get(id = remote_pending_friend_id)            
            
            FriendRequest.objects.filter(sender=author, receiver=remote_pending_friend).delete()
            author.friends.add(remote_pending_friend)     
    
    def sync_removed_friends(self, local_author_id, remote_friend_id, remote_host):
        print "Checking remote friend list with removed friends..."
        
        final_url = remote_host+"friends/"+local_author_id+'/'+remote_friend_id+'/'
        
        r = self.rc.get_from_remote(final_url, self.rc.get_node_auth(remote_host))
        is_friend = json.loads(r.text).get('friends')
                        
        if not is_friend:
            print "Author which no longer be friend found, removing from list..."
            author = Author.objects.get(id = local_author_id)
            remote_friend = Author.objects.get(id = remote_friend_id)            
            
            author.friends.remove(remote_friend) 