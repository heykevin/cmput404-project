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
    },
    {
        'username': "Eddie",
        "first_name": "Eddie",
        "last_name": "Antonio Santos",
        "email": "easantos@ualberta.ca",
        'password': 'cooldogs'
    }    
]

AUTHOR_LIST = [
    {
        'github_username': 'coolbears',
        'bio': 'cool',
        'host': 'http://testserver/'
    },
    {
        'github_username': 'coolcats',
        'bio': 'very cool',
        'host': 'http://testserver/'
    },
    {
        'github_username': 'cooldogs',
        'bio': 'very very cool',
        'host': 'http://testserver/'
    }        
]

REMOTE_AUTHOR_LIST = [
    {
        'github_username': 'coolbears',
        'bio': 'cool',
        'host': 'http://api-bloggyblog404.herokuapp.com/'
    },
]


POST_LIST =[
    {
        "title": "Cool Bear",
        "source": "https://c404-web.slack.com/messages/general/",
        "origin": "https://c404-web.slack.com/messages/general/",
        "description": "This is a cool bear.",
        "content": "I am a cool bear!",
        "category": "bear",
        "visibility": "PUBLIC",
        "contentType": "text/plain"
    },
    {
        "title": "Very Cool Bear",
        "source": "https://c404-web.slack.com/messages/general/",
        "origin": "https://c404-web.slack.com/messages/general/",
        "description": "This is a very cool bear.",
        "content": "I am a very cool bear!",
        "category": "bear",
        "visibility": "PRIVATE",
        "contentType": "text/plain"
    },
    {
        "title": "Very Very Cool Bear",
        "source": "https://c404-web.slack.com/messages/general/",
        "origin": "https://c404-web.slack.com/messages/general/",
        "description": "This is a very very cool bear.",
        "content": "I am a very very cool bear!",
        "category": "bear",
        "visibility": "FRIENDS",
        "contentType": "text/plain"
    }        
]

def get_post_json(index):
    return POST_LIST[index]

def createAuthor(self, index):
    self.user = User.objects.create_user(is_active=True, **(USER_LIST[index]))    
    return Author.objects.create(user=self.user, **(AUTHOR_LIST[index]))

def getAuthor(self, index):
    return dict(USER_LIST[index], **(AUTHOR_LIST[index]))


def check201(statusCode):
    return statusCode == status.HTTP_201_CREATED
