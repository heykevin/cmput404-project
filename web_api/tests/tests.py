from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from rest_framework import status
from requests.auth import HTTPBasicAuth
from testutils import *
from ..models import *

import base64

class HostCheckTestCase(APITestCase):
    
    def test_host_name(self):
	request_factory = APIRequestFactory()
	request = request_factory.get('/posts/',{},format='json')
	self.assertEqual(request.get_host(),'testserver')

class ActivePermissionTestCase(APITestCase):
    
    def test_active_permission(self):
	
	userObj = User.objects.create_user(is_active=False, **(USER_LIST[0])) 
	self.author = Author.objects.create(user=userObj, **(AUTHOR_LIST[0]))
	
	self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Ahindle:coolbears'))
	response = self.client.put('/author/%s/' % self.author.id, {
	    "displayName": "CoolBears",
	    "first_name": "Cool",
	    "last_name": "Bears",
	    "email": "cool.bears@ualberta.ca",
	    "bio": "I am a cool bear!",
	    "github_username": "https://github.com/coolbear",
	    "password": "a1b2c3d4"
	}, format='json')
	
	self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, response)
	
	
class AuthorServiceTestCase(APITestCase):
    
    def test_create_author(self):
        response = self.client.post('/author/', {
            "displayName": "Ahindle",
            "first_name": "Abram",
            "last_name": "Hindle",
            "email": "abram.hindle@ualberta.ca",
            "bio": "",
            "host": "http://127.0.0.1:8000/",
            "github_username": "https://github.com/abramhindle",
            "password": "abcdefg"
        }, format='json')
        
        self.assertTrue(check201(response.status_code), response)
        self.assertEqual(Author.objects.count(), 1)
        self.assertEqual(Author.objects.all()[0].user.username, 'Ahindle')
	self.assertFalse(Author.objects.all()[0].user.is_active)
	

    def test_get_author(self):
        self.author1 = createAuthor(self,0)
	self.author2 = createAuthor(self,1)
	self.author3 = createAuthor(self,2)
	self.author1.friends.add(self.author2)

        response = self.client.get('/author/%s/' % self.author1.id, {
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, response)
        self.assertEqual(getAuthor(self,0)['username'], response.data['displayName'])
        self.assertEqual(str(self.author1.id), response.data['id'])
	self.assertEqual(str(self.author2.id), response.data['friends'][0]['id'])
	
    def test_update_author_profile(self):
	
	self.author = createAuthor(self,0)
	
	response = self.client.put('/author/%s/' % self.author.id, {
	    "displayName": "CoolBears",
	    "first_name": "Cool",
	    "last_name": "Bears",
	    "email": "cool.bears@ualberta.ca",
	    "bio": "I am a cool bear!",
	    "github_username": "https://github.com/coolbear",
	    "password": "a1b2c3d4"
	}, format='json')
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	
	updated_author = Author.objects.get(id=self.author.id)
	updated_user = updated_author.user
	
	self.assertEqual(updated_author.bio, "I am a cool bear!")
	self.assertEqual(updated_author.host, "http://testserver/")
	self.assertEqual(updated_author.github_username, "https://github.com/coolbear")
	
	self.assertEqual(updated_user.username, "CoolBears")
	self.assertEqual(updated_user.first_name, "Cool")
	self.assertEqual(updated_user.last_name, "Bears")
	self.assertEqual(updated_user.email, "cool.bears@ualberta.ca")
	# self.assertEqual(updated_user.password, "a1b2c3d4")

class FriendRequestTestCase(APITestCase):
    
    def test_send_request(self):
	self.sender = createAuthor(self,0)
	self.receiver = createAuthor(self,1)	
	
	response = self.client.post('/friendrequest/', {
	    "query" : "friendrequest",
	    "author" : {
	        "id" : self.sender.id,
	        "host" : self.sender.host,
	        "displayName" : self.sender.user.username,
	    },	
	    "friend": {
	        "id" : self.receiver.id,
	        "host" : self.receiver.host,
	        "displayName" : self.receiver.user.username,
	        "url" : self.receiver.host+"author/"+str(self.receiver.id)
	    }
	}, format='json')
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertTrue(FriendRequest.objects.filter(sender=self.sender, receiver=self.receiver).exists())

	response = self.client.post('/friendrequest/', {
	    "query" : "friendrequest",
	    "author" : {
	        "id" : self.sender.id,
	        "host" : self.sender.host,
	        "displayName" : self.sender.user.username,
	    },	
	    "friend": {
	        "id" : self.receiver.id,
	        "host" : self.receiver.host,
	        "displayName" : self.receiver.user.username,
	        "url" : self.receiver.host+"author/"+str(self.receiver.id)
	    }
	}, format='json')

	self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response)
    
    def test_response_request(self):
	self.sender = createAuthor(self,0)
	self.receiver = createAuthor(self,1)


	self.client.post('/friendrequest/', {
	    "query" : "friendrequest",
	    "author" : {
	        "id" : self.sender.id,
	        "host" : self.sender.host,
	        "displayName" : self.sender.user.username,
	    },	
	    "friend": {
	        "id" : self.receiver.id,
	        "host" : self.receiver.host,
	        "displayName" : self.receiver.user.username,
	        "url" : self.receiver.host+"author/"+str(self.receiver.id)
	    }
	}, format='json')
		
	response = self.client.post('/friendrequest/', {
	    "query" : "friendresponse",
	    "author" : {
	        "id" : self.sender.id
	    },	
	    "friend": {
	        "id" : self.receiver.id
	    },
	    "accepted" : False
	}, format='json')

	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertFalse(Author.objects.get(id=self.receiver.id).friends.all().filter(id=self.sender.id).exists())
	self.assertFalse(Author.objects.get(id=self.sender.id).friends.all().filter(id=self.receiver.id).exists())
	self.assertFalse(FriendRequest.objects.filter(sender=self.sender, receiver=self.receiver).exists())
	
    def test_unfriend(self):
	self.sender = createAuthor(self,0)
	self.receiver = createAuthor(self,1)
	self.sender.friends.add(self.receiver)
	
	response = self.client.post('/friendrequest/', {
		    "query" : "unfriend",
		    "author" : {
		        "id" : self.sender.id
		    },	
		    "friend": {
		        "id" : self.receiver.id
		    },
	}, format='json')	
	
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	self.assertTrue(Author.objects.get(id=self.receiver.id).friends.all().filter(id=self.sender.id).exists()==False)
	self.assertTrue(Author.objects.get(id=self.sender.id).friends.all().filter(id=self.receiver.id).exists()==False)

# Some tests of this section is hardcoded.
class SelfConnectFriendRequestTestCase(APITestCase):
    
    def test_send_remote_friend_request(self):
	user=User(username="Joshua", is_active=False)
	user.save()
	Author.objects.create(id='11111ab1-1cc4-11a0-9c0e-7502c53347ac',user=user)
	
	response = self.client.post('/friendrequest/', {
	    "query" : "friendrequest",
	    "author" : {
	        "id" : '11111ab1-1cc4-11a0-9c0e-7502c53347ac',
	        "host" : 'http://testserver/',
	        "displayName" : 'Joshua'
	    },	
	    "friend": {
	        "id" : '04952ab1-1cc4-44a0-9c0e-7502c53347ac',
	        "host" : 'http://api-bloggyblog404.herokuapp.com/',
	        "displayName" : 'Abram',
	        "url" : 'http://api-bloggyblog404.herokuapp.com/author/04952ab1-1cc4-44a0-9c0e-7502c53347ac'
	    }
	}, format='json')
	
	if response.status_code!=status.HTTP_200_OK and response.status_code!=status.HTTP_400_BAD_REQUEST:
	    self.assertTrue(False)    

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
	
	self.author1.friends.add(self.author2)
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

class PersonalAuthorStreamTestCase(APITestCase):
    
    def setUp(self):
	self.author1 = createAuthor(self,0)
	self.author2 = createAuthor(self,1)
	self.author3 = createAuthor(self,2)
	self.author1.friends.add(self.author2)
    
    def test_get_personal_posts(self):
	
	self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Ahindle:coolbears'))
	self.client.post('/posts/', get_post_json(0), format='json')	# public
	self.client.post('/posts/', get_post_json(1), format='json')	# private
	self.client.post('/posts/', get_post_json(2), format='json')	# friends ! This post appears cannot be access by author itself !
	
	response = self.client.get('/author/%s/posts/' % self.author1.id, {}, format='json')
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	# Post with index 0, 1, 2
	self.assertEqual(len(response.data['posts']), 3)
	
	
	self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Joshua:coolcats'))
	
	response = self.client.get('/author/%s/posts/' % self.author1.id, {}, format='json')
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	# Post with index 0, 2
	self.assertEqual(len(response.data['posts']), 2)
	
	self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Eddie:cooldogs'))
	
	response = self.client.get('/author/%s/posts/' % self.author1.id, {}, format='json')
	self.assertEqual(response.status_code, status.HTTP_200_OK, response)
	# Post with index 0
	self.assertEqual(len(response.data['posts']), 1)	

class PostTestCase(APITestCase):

	def setUp(self):
		self.postAuthor = createAuthor(self,0)

	def test_post(self):
		# test for POST post
		# postAuthor1: Ahindle post, a public post
		self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Ahindle:coolbears'))
		response = self.client.post('/posts/', {
				'title': 'comp sci 404',
				'source': 'http://127.0.0.1:8000',
				'origin': 'http://127.0.0.1:8000',
				'description': 'This post is about comp sci 404',
				'content': 'comp sci 404 project, blah blah blah',
				'category': 'compsci',
				'visibility_choice': 'Public',
				'contentType': 'text/markdown'
			}, format='json'
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED, response)
		self.pId1 = response.data['id']
		# postAuthor: Ahindle post, a private post
		response = self.client.post('/posts/', {
				'title': 'Joshua lab notes',
				'source': 'http://127.0.0.1:8000/lab',
				'origin': 'http://127.0.0.1:8000/ualberta',
				'description': 'lab notes for next week',
				'content': 'lab for next week will have 3 hours of exam',
				'category': 'compsci',
				'visibility_choice': 'private',
				'contentType': 'text/markdown'
			}, format='json'
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED, response)
		self.pId2 = response.data['id']
		# postAuthor: Ahindle post, a public post
		response = self.client.post('/posts/', {
				'title': 'comp sci 404 notice',
				'source': 'http://127.0.0.1:8000',
				'origin': 'http://127.0.0.1:8000/ualberta',
				'description': 'class cancel notice',
				'content': 'class this week is cancelled due to flu',
				'category': 'compsci',
				'visibility_choice': 'public',
				'contentType': 'text/markdown'
			}, format='json'
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED, response)
		self.pId3 = response.data['id']
		# postAuthor: Ahindle post, a public post with wrong values
		response = self.client.post('/posts/', {
				'title': 'comp sci 404',
				'source': 'who cares about source',
				'origin': 'who cares about origin',
				'description': 'This post is about comp sci 404',
				'content': 'comp sci 404 project, blah blah blah',
				'category': 'compsci',
				'visibility_choice': 'something',
				'contentType': 'text/json'
			}, format='json'
		)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response)

		# test for GET post1
		response = self.client.get('/posts/%s/' % self.pId1, {}, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK, response)
		# test for GET post2
		response = self.client.get('/posts/%s/' % self.pId2, {}, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK, response)
		# test for GET post3
		response = self.client.get('/posts/%s/' % self.pId3, {}, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK, response)
		# test for GET random post id
		response = self.client.get('/posts/0b261288-2242-4cd6-b329-ba7cee6813f0/', {}, format='json')
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response)

		# test for UPDATE post1
		response = self.client.get('/posts/%s/' % self.pId1, {}, format='json')
		response = self.client.put('/posts/%s/' % self.pId1, {
			'title': 'new post1 title',
			'content': 'this is a changed content of post 1',
			'source': 'http://127.0.0.1:8000/ualberta',
			'description': 'new post1 desc'
			}, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK, response)
		self.assertTrue(response.data['title'] == 'new post1 title')
		self.assertTrue(response.data['content'] == 'this is a changed content of post 1')
		self.assertTrue(response.data['source'] == 'http://127.0.0.1:8000/ualberta')
		self.assertTrue(response.data['description'] == 'new post1 desc')

		# test for DELETE post
		response = self.client.delete('/posts/%s/' % self.pId1, {}, format='json')
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, response)
		response = self.client.get('/posts/%s/' % self.pId1, {}, format='json')
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response)
		response = self.client.get('/posts/', {}, format='json')
		# from 3 posts, 1 was deleted so total 2 posts left
		self.assertTrue(len(response.data['posts']) == 2)

class CommentTestCase(APITestCase):

	def setUp(self):
		self.commentAuthor1 = createAuthor(self,0)
		self.commentAuthor2 = createAuthor(self,1)
		self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Ahindle:coolbears'))
		response = self.client.post('/posts/', {
				'title': 'comp sci 404',
				'source': 'http://127.0.0.1:8000',
				'origin': 'http://127.0.0.1:8000',
				'description': 'This post is about comp sci 404',
				'content': 'comp sci 404 project, blah blah blah',
				'category': 'compsci',
				'visibility_choice': 'Public',
				'contentType': 'text/markdown'
			}, format='json'
		)
		self.pId1 = response.data['id']

	def test_comment(self):
		# commentAuthor1: Ahindle logged in
		# test for creating a comment
		self.client.credentials(HTTP_AUTHORIZATION='Basic ' + base64.b64encode('Ahindle:coolbears'))
		response = self.client.post('/posts/%s/comments/' % self.pId1, {
				'content': 'the post has really good information, I like it'
			}, format='json'
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED, response)

		# test for getting a comment
		response = self.client.get('/posts/%s/comments/' % self.pId1, {}, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK, response)
		comment = response.data['comments']
		self.assertTrue(comment[0]['id'] != None)