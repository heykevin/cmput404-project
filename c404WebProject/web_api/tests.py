from django.test import TestCase
from rest_framework.test import *


class AuthorServiceTestCase(TestCase):
    
    def test_create_author():
        client = RequestsClient()
        
        response = client.post('/author/', json={
            "id": "14e310cd-8c9f-4140-a8ed-b93112e54a6a",
            "user": {
                "first_name": "Abram",
                "last_name": "Hindle",
                "email": "abram.hindle@ualberta.ca"
            },
            "displayName": "AbramHindle",
            "bio": "",
            "url": "https://github.com/abramhindle",
            "git": "https://github.com/abramhindle"
        })
        
        self.assertEqual(response.status_code,200)