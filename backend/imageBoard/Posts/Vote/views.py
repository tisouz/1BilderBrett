from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from imageBoard.models import Post
from .serializers import VotePostSerializer

class VotePost(CreateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = VotePostSerializer

    def get_serializer_context(self):
        context = super(VotePost, self).get_serializer_context()
        context.update({"request": self.request})
        return context
