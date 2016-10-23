from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
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
	self.assertEqual(str(self.author1.id), response.data['authors'][0])
	self.assertEqual(str(self.author2.id), response.data['authors'][1])
	self.assertEqual(False, response.data['friends'])
	
	self.author1.friends.add(self.author2.id)
	response = self.client.get('/friends/%s/%s/' % (self.author1.id, self.author2.id), {
	}, format='json')	
	self.assertEqual(True, response.data['friends'])
        
        

class LoginTestCase(APITestCase):
    
    def setUp(self):
        self.author = createAuthor(self,0)

    def test_success_login(self):
        response = self.client.post('/login/', {
            'username': 'Ahindle',
            'password': 'coolbears'
            }, format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK, response)
        self.assertTrue(response.data['token'])

    def test_fail_login(self):
        response = self.client.post('/login/', {
            'username': 'Ahindle',
            'password': 'wrongpass'
            }, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response)
        self.assertTrue(response.data['non_field_errors'] == ['Unable to login with provided credentials.'])