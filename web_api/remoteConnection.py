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
    
    def check_group_for_remove_slash(self, url):
        if 'http://socialnets404.herokuapp.com/' in url:
            return self.remove_url_slash(url)
    
    def remove_url_slash(self, url):
        if url[-1] == '/':
            return str(url)[:-1]       

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
            print "Localhost found, assuming you are sending request from local."
            return True
        
        if 'HTTP_ORIGIN' in request.META.keys():
            if request.META['HTTP_ORIGIN'] == 'http://bloggyblog404.herokuapp.com' or request.META['HTTP_ORIGIN'] == 'https://bloggyblog404.herokuapp.com':
                print "Request from our own client, OK."
                return True
        
        print "Request from remote host, checking auth information."
        
        # Client case.
        
        print "Remote node confirmed, checking access permission."
        
        for node in Node.objects.all():
            if node.user == request.user and request.user.is_authenticated():
                print "Access permission checking successful."
                return True
        
        print "Remote node access permission checking failed."
        return True
    
    def get_node_auth(self, remote_host):
        
        print "Getting auth information from DB for %s" % remote_host
        for node in Node.objects.all():
            print "Checking " + node.node_url
            if remote_host == node.node_url:
                return (node.username, node.password)
        
        print "\nFailed..."
        return None
    
    def post_to_remote(self, url, data, auth):
        print 'Sending post request to: ' + self.check_group_for_remove_slash(url)
        print 'JSON data: ' 
        print data
        r = None
        try:
            if auth == None:
                print "No auth information."
                r = requests.post(self.check_group_for_remove_slash(url), json=data)
            else:
                print "Sever access auth: {" + auth[0] + " : " + auth[1] + "}"
                r = requests.post(self.check_group_for_remove_slash(url), json=data, auth=auth)
            
            print 'Getting ' + str(r.status_code)+' from the remote server.'
            print 'Message: ' + r.text     
        except:
            print 'Connection failed with '+ str(r.status_code) 
            print 'Message: ' + r.text     

        return r
    
    def get_from_remote(self, url, auth):
        print 'Sending get request to: ' + self.remove_url_slash(url)
        r=None

        try:
            if auth == None:
                print "No auth information."
                r = requests.get(self.remove_url_slash(url))
            else:
                r = requests.get(self.remove_url_slash(url), auth=auth)
            
            print 'Getting ' + str(r.status_code)+' from the remote server.'  
            print 'Message: ' + r.text     
        except:
            print 'Connection failed with '+ str(r.status_code) 
            print 'Message: ' + r.text     

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
        # print "Checking remote friend list with removed friends..."
        
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
        # print "Checking remote friend list with removed friends..."
        
        final_url = remote_host+"friends/"+local_author_id+'/'+remote_friend_id+'/'
        
        r = self.rc.get_from_remote(final_url, self.rc.get_node_auth(remote_host))
        is_friend = json.loads(r.text).get('friends')
                        
        if not is_friend:
            print "Author which no longer be friend found, removing from list..."
            author = Author.objects.get(id = local_author_id)
            remote_friend = Author.objects.get(id = remote_friend_id)            
            
            author.friends.remove(remote_friend) 