from ..models import Author, User
from rest_framework import status

USER = {
        'username': "Ahindle",
        "first_name": "Abram",
        "last_name": "Hindle",
        "email": "abram.hindle@ualberta.ca",
        'password': 'coolbears'
    }

AUTHOR = {
        'github_username': 'coolbears',
        'bio': 'cool',
        'host': 'www.coolbears.ca'
}

def createAuthor(self):
    self.user = User.objects.create_user(**USER)
    return Author.objects.create(user=self.user, **AUTHOR)

def getAuthor(self):
    return dict(USER, **AUTHOR)


def check201(statusCode):
    return statusCode == status.HTTP_201_CREATED
