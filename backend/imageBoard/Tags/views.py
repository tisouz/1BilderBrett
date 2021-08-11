from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from .serializers import TagPostSerializer

class TagPost(CreateAPIView):
    serializer_class = TagPostSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save()
