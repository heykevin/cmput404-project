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
        self.author = createAuthor(self)

        response = self.client.get('/author/%s/' % self.author.id, {
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, response)
        self.assertEqual(getAuthor(self)['username'], response.data['displayName'])
        self.assertEqual(str(self.author.id), response.data['id'])


class LoginTestCase(APITestCase):
    
    def setUp(self):
        self.author = createAuthor(self)

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