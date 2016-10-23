from rest_framework_jwt.settings import api_settings
from datetime import datetime
from models import Author
from serializers import UserSerializer, AuthorSerializer

# Returns a JWT token with the author encrypted and expiry date
# Requests that require authorization should be sent with headers:
# Authorization: JWT <token>

def generate_token(user):
    author = Author.objects.get(user=user)
    return {
        'author': AuthorSerializer(author).data,
        'exp': datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA
    }
