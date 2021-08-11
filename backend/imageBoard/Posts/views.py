from rest_framework.generics import RetrieveAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import CursorPagination

from django.db.models import Count

from imageBoard.models import Post
from .serializers import PostSerializer, PostPostSerializer, PreviewSerializer

class PostDetail(RetrieveAPIView):
    """
    Retrieve a single Post based on the id
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


class CursorSetPagination(CursorPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    ordering = '-date_created' # '-created' is default


class PostList(ListCreateAPIView):
    """
    List previews or create a Post.
    """
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = CursorSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Post.objects.all()
        tags = self.request.query_params.get('tags')

        if tags is not None:
            tags = tags.split()
            for tag in tags:
                print(tag)
            queryset = queryset.filter(tags__content__in=tags).annotate(tags_count=Count("tags")).filter(tags_count=len(tags))
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostPostSerializer
        return PreviewSerializer

    def list(self, request, *args, **kwargs):
        previews = self.get_queryset()
        paginated_messages = self.paginate_queryset(previews)
        serializer_class = self.get_serializer_class()
        results = serializer_class(paginated_messages, many=True, context={'request': request}).data
        response = self.get_paginated_response(results)
        return response

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, ip_address=self.request.META['REMOTE_ADDR'])