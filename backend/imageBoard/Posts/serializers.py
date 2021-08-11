from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from django.conf import settings

from imageBoard.models import Post
from imageBoard.utils import filetype_is_valid
from imageBoard.Comments.serializers import CommentSerializer
from imageBoard.Tags.serializers import TagSerializer

class PreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'thumbnail')


class PostPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [ #'user'.
                   #'ip_address',
                  'file']

    def validate_file(self, file):
        if file.size > settings.CONTENT_MAX_SIZE:
            raise serializers.ValidationError(('Max file size is {} and your file size is {}'.
                                                format(settings.CONTENT_MAX_SIZE, file.size)))
        if not filetype_is_valid(file):
            raise ValidationError("MIME-Type didn't match")
        return file

class PostSerializer(serializers.ModelSerializer):
  tags = TagSerializer(read_only=True, many=True)
  comments = serializers.SerializerMethodField()

  username=serializers.SerializerMethodField("get_username")
  def get_username(self, obj):
    return obj.user.username

  def get_comments(self, instance):
      comments = instance.comment_set.order_by('-date_created')
      return CommentSerializer(comments, read_only=True, many=True).data

  class Meta:
    model = Post
    fields = ['id', 'user', 'username', 'date_created', 'thumbnail', 'file', 'media_type', 'tags', 'comments', 'num_vote_up', 'num_vote_down']
