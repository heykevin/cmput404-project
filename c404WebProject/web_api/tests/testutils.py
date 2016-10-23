from ..models import Author, User
from rest_framework import status

# These are two PARALLEL list which used to create more than one author.
# Can always add more author.
USER_LIST = [
    {
        'username': "Ahindle",
        "first_name": "Abram",
        "last_name": "Hindle",
        "email": "abram.hindle@ualberta.ca",
        'password': 'coolbears'
    },
    {
        'username': "Joshua",
        "first_name": "Joshua",
        "last_name": "Campbell",
        "email": "joshua2@ualberta.ca",
        'password': 'coolcats'
    }    
]

AUTHOR_LIST = [
    {
        'github_username': 'coolbears',
        'bio': 'cool',
        'host': 'www.coolbears.ca'
    },
    {
        'github_username': 'coolcats',
        'bio': 'very cool',
        'host': 'www.coolcats.ca'
    }    
]

def createAuthor(self, index):
    self.user = User.objects.create_user(**(USER_LIST[index]))    
    return Author.objects.create(user=self.user, **(AUTHOR_LIST[index]))

def getAuthor(self, index):
    return dict(USER_LIST[index], **(AUTHOR_LIST[index]))


def check201(statusCode):
    return statusCode == status.HTTP_201_CREATED
