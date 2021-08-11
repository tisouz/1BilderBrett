from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from .serializers import CommentPostSerializer

class CommentsDetail(CreateAPIView):
    """
    view to create comments
    """
    serializer_class = CommentPostSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, ip_address=self.request.META['REMOTE_ADDR'])