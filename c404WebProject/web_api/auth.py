from serializers import UserSerializer, AuthorSerializer
from models import Author

# Returns a JWT token and the author object requesting the token if credentials are correct
def login_response(token, user=None, request=None):
    return {
        'token': token,
        'author': AuthorSerializer(author, context={'request': request}).data
    }