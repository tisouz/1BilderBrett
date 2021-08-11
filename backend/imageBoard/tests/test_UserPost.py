from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files import File
from django.conf import settings

from rest_framework.test import APIRequestFactory

import tempfile
import json

from ..models import Post
from ..Posts.views import PostList, PostDetail

class MyTestCase(TestCase):
    def setUp(self):
        settings.MEDIA_ROOT = tempfile.mkdtemp()
        self.user = User.objects.create_user(username='testuser', password='12345')
        Post.objects.create(user = self.user, file=File(open('imageBoard/tests/TestFiles/Images/gifTestFile.gif', 'rb')), ip_address="127.0.0.1", media_type= Post.IMAGE) 
        Post.objects.create(user = self.user, file=File(open('imageBoard/tests/TestFiles/Images/pngTestFile.png', 'rb')), ip_address="127.0.0.1", media_type= Post.IMAGE)
        Post.objects.create(user = self.user, file=File(open('imageBoard/tests/TestFiles/Images/jpgTestFile.jpg', 'rb')), ip_address="127.0.0.1", media_type= Post.IMAGE)

    def test_getPostList(self):
        view = PostList.as_view()
        factory = APIRequestFactory()
        request = factory.get('/posts', format='json')
        response = view(request)
        response.render()
        content = json.loads(response.content)
        self.assertEqual(len(content), 3)

    def test_getPost(self):
        view = PostDetail.as_view()
        factory = APIRequestFactory()
        request = factory.get('/posts/1', format='json')
        response = view(request, pk='1')
        response.render()
        content = json.loads(response.content)
        self.assertEqual(content['id'], 1)