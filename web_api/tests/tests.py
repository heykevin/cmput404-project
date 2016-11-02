from django.test import TestCase
import base64
from rest_framework.test import APITestCase
from rest_framework import status
from requests.auth import HTTPBasicAuth
from testutils import check201, createAuthor, getAuthor
from ..models import *

class AuthorServiceTestCase(APITestCase):
    
    def test_create_author(self):
        response = self.client.post('/author/', {
            "displayName": "Ahindle",
            "first_name": "Abram",
            "last_name": "Hindle",
            "email": "abram.hindle@ualberta.ca",
            "bio": "",
            "host": "http://softwareprocess.es/static/SoftwareProcess.es.html",
            "github_username": "https://github.com/abramhindle",
            "password": "abcdefg"
        }, format='json')
        
        self.assertTrue(check201(response.status_code), response)
        self.assertEqual(Author.objects.count(), 1)
        self.assertEqual(Author.objects.all()[0].user.username, 'Ahindle')

    def test_get_author(self):
        self.author1 = createAuthor(self,0)
	self.author2 = createAuthor(self,1)
	self.author3 = createAuthor(self,2)
	self.author1.friends.add(self.author2)

        response = self.client.get('/author/%s/' % self.author1.id, {
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, response)
        self.assertEqual(getAuthor(self,0)['username'], response.data['displayName'])
        self.assertEqual(str(self.author1.id), response.data['id'])
	self.assertEqual(str(self.author2.id), response.data['friends'][0]['id'])
	
    def test_update_author_profile(self):
	
	self.author = createAuthor(self,0)
	
	response = self.client.put('/author/%s/' % self.author.id, {
	    "displayName": "CoolBears",
	    "first_name": "Cool",
	    "last_name": "Bears",
	    "email": "cool.bears@ualberta.ca",
	    "bio": "I am a cool bear!",
	    "host": "http://coolbears.com/mostCoolBear/",
	    "github_username": "https://github.com/coolbear",
	    "password": "a1b2c3d4"
	}, format='json')	
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	
	updated_author = Author.objects.get(id=self.author.id)
	updated_user = updated_author.user
	
	self.assertEqual(updated_author.bio, "I am a cool bear!")
	self.assertEqual(updated_author.host, "http://coolbears.com/mostCoolBear/")
	self.assertEqual(updated_author.github_username, "https://github.com/coolbear")
	
	self.assertEqual(updated_user.username, "CoolBears")
	self.assertEqual(updated_user.first_name, "Cool")
	self.assertEqual(updated_user.last_name, "Bears")
	self.assertEqual(updated_user.email, "cool.bears@ualberta.ca")
	self.assertEqual(updated_user.password, "a1b2c3d4")

class FriendRequestTestCase(APITestCase):
    
    def test_send_request(self):
	self.sender = createAuthor(self,0)
	self.receiver = createAuthor(self,1)	
	
	response = self.client.post('/friendrequest/', {
	    "query" : "friendrequest",
	    "author" : {
	        "id" : self.sender.id,
	        "host" : self.sender.host,
	        "displayName" : self.sender.user.username,
	    },	
	    "friend": {
	        "id" : self.receiver.id,
	        "host" : self.receiver.host,
	        "displayName" : self.receiver.user.username,
	        "url" : self.receiver.host+"author/"+str(self.receiver.id)
	    }
	}, format='json')
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertTrue(FriendRequest.objects.filter(sender=self.sender, receiver=self.receiver).exists())

	response = self.client.post('/friendrequest/', {
	    "query" : "friendrequest",
	    "author" : {
	        "id" : self.sender.id,
	        "host" : self.sender.host,
	        "displayName" : self.sender.user.username,
	    },	
	    "friend": {
	        "id" : self.receiver.id,
	        "host" : self.receiver.host,
	        "displayName" : self.receiver.user.username,
	        "url" : self.receiver.host+"author/"+str(self.receiver.id)
	    }
	}, format='json')

	self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response)
    
    def test_response_request(self):
	self.sender = createAuthor(self,0)
	self.receiver = createAuthor(self,1)


	self.client.post('/friendrequest/', {
	    "query" : "friendrequest",
	    "author" : {
	        "id" : self.sender.id,
	        "host" : self.sender.host,
	        "displayName" : self.sender.user.username,
	    },	
	    "friend": {
	        "id" : self.receiver.id,
	        "host" : self.receiver.host,
	        "displayName" : self.receiver.user.username,
	        "url" : self.receiver.host+"author/"+str(self.receiver.id)
	    }
	}, format='json')
		
	response = self.client.post('/friendrequest/', {
	    "query" : "friendresponse",
	    "author" : {
	        "id" : self.sender.id
	    },	
	    "friend": {
	        "id" : self.receiver.id
	    },
	    "accepted" : 'true'
	}, format='json')

	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertTrue(Author.objects.get(id=self.receiver.id).friends.all().filter(id=self.sender.id).exists())
	self.assertTrue(Author.objects.get(id=self.sender.id).friends.all().filter(id=self.receiver.id).exists())
    
    def test_check_friendrequest_status(self):
	self.sender = createAuthor(self,0)
	self.receiver = createAuthor(self,1)
	
	self.client.post('/friendrequest/', {
	    "query" : "friendrequest",
	    "author" : {
	        "id" : self.sender.id,
	        "host" : self.sender.host,
	        "displayName" : self.sender.user.username,
	    },	
	    "friend": {
	        "id" : self.receiver.id,
	        "host" : self.receiver.host,
	        "displayName" : self.receiver.user.username,
	        "url" : self.receiver.host+"author/"+str(self.receiver.id)
	    }
	}, format='json')
	
	response = self.client.post('/friendrequest/', {
	    "query" : "friendrequeststatus",
	    "author" : {
	        "id" : self.sender.id
	    }
	}, format='json')
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertEqual(str(FriendRequest.objects.filter(sender=self.sender, receiver=self.receiver)[0].receiver.id), response.data['sent to'][0]['id'])
	
    def test_unfriend(self):
	self.sender = createAuthor(self,0)
	self.receiver = createAuthor(self,1)
	self.sender.friends.add(self.receiver)
	
	response = self.client.post('/friendrequest/', {
		    "query" : "unfriend",
		    "author" : {
		        "id" : self.sender.id
		    },	
		    "friend": {
		        "id" : self.receiver.id
		    },
		    "accepted" : 'true'
	}, format='json')	
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertTrue(Author.objects.get(id=self.receiver.id).friends.all().filter(id=self.sender.id).exists()==False)
	self.assertTrue(Author.objects.get(id=self.sender.id).friends.all().filter(id=self.receiver.id).exists()==False)	

class FriendServiceTestCase(APITestCase):
    
    def test_friend_check(self):
        self.author1 = createAuthor(self,0)
	self.author2 = createAuthor(self,1)
	
        response = self.client.get('/friends/%s/%s/' % (self.author1.id, self.author2.id), {
	}, format='json')
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertEqual("friends", response.data['query'])
	self.assertEqual(str(self.author1.id), response.data['authors'][0])
	self.assertEqual(str(self.author2.id), response.data['authors'][1])
	self.assertEqual(False, response.data['friends'])
	
	self.author1.friends.add(self.author2)
	response = self.client.get('/friends/%s/%s/' % (self.author1.id, self.author2.id), {
	}, format='json')	
	self.assertEqual(True, response.data['friends'])
    
    def test_get_friends(self):
	self.author1 = createAuthor(self,0)
	self.author2 = createAuthor(self,1)	
        self.author1.friends.add(self.author2.id)
	
	response = self.client.get('/friends/%s/' % (self.author1.id), {
	}, format='json')
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertEqual("friends", response.data['query'])
	self.assertEqual(self.author2.id, response.data['authors'][0])
    
    def test_get_friend_list(self):
	self.author1 = createAuthor(self,0)
	self.author2 = createAuthor(self,1)
	self.author3 = createAuthor(self,2)
	
	self.author1.friends.add(self.author2.id)
	
	response = self.client.post('/friends/%s/' % (self.author1.id), {
	    "query" : "abc",
	}, format='json')
	self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response)
	
	response = self.client.post('/friends/%s/' % (self.author1.id), {
	    "query" : "friends",
	    "author" : self.author1.id,
	    "authors" : [self.author2.id, self.author3.id]
	}, format='json')
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertEqual("friends", response.data['query'])
	self.assertEqual(str(self.author1.id), str(response.data['author']))
	self.assertEqual(1, len(response.data['authors']))
	self.assertEqual(str(self.author2.id), str(response.data['authors'][0]))

class LoginTestCase(APITestCase):
    
    def setUp(self):
        self.author = createAuthor(self,0)

    def test_success_login(self):
        self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Ahindle:coolbears'))
        response = self.client.post('/login/')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response)
        self.assertTrue(response.data['author'])

    def test_fail_login(self):
        self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Ahindle:wrongpass'))
        response = self.client.post('/login/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, response)
        self.assertTrue(response.data['detail'] == 'Invalid username/password.')
