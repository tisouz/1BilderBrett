from django.urls import path

from .Comments.views import CommentsDetail
from .Tags.views import TagPost
from .Posts.views import PostDetail, PostList
from .Posts.Vote.views import VotePost
from .Auth.views import ChangePassword

urlpatterns = [
   path('posts/', PostList.as_view()),
   path('posts/<int:pk>', PostDetail.as_view()),
   path('comments/', CommentsDetail.as_view()),
   path('tags/', TagPost.as_view()),
   path('changePassword/<int:pk>', ChangePassword.as_view()),
   path('vote/', VotePost.as_view())
]
