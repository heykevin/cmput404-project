from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Author

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
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Author.objects.count(), 1)
        # self.assertEqual(Author.objects.get('user').first_name, "Abram")


# class LoginTestCase(APITestCase):
#     def test_get_token(self):
#         user = {
#             'username': 'Idra',
#             'first_name': 'Greg',
#             'last_name': 'Fields',
#             'email': 'zerg@battle.net',
#             'password': 'sc2'
#         }
#         self.user = Author.objects.create(**user)
#         author = {
#             'user': self.user,
#             'github_username': 'zerg',
#             'bio': 'hello',
#             'host': 'www.cool.ca'
#         }
#         self.author = Author.objects.create(**author)
