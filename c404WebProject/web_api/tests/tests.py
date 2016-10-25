from django.test import TestCase
import base64
from rest_framework.test import APITestCase
from rest_framework import status
from requests.auth import HTTPBasicAuth
from testutils import check201, createAuthor, getAuthor
from ..models import Author, User

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
        self.author = createAuthor(self,0)

        response = self.client.get('/author/%s/' % self.author.id, {
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, response)
        self.assertEqual(getAuthor(self,0)['username'], response.data['displayName'])
        self.assertEqual(str(self.author.id), response.data['id'])

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
	
	self.author1.friends.add(self.author2.id)
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
