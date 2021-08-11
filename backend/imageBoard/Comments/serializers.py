from imageBoard.models import Comment

from rest_framework.exceptions import ValidationError
from rest_framework import serializers


class CommentSerializer(serializers.ModelSerializer):
  username=serializers.SerializerMethodField("get_username")
  def get_username(self, obj):
    return obj.user.username
  class Meta:
    model = Comment
    fields=['id', 'user', 'username', 'content']


class CommentPostSerializer(serializers.ModelSerializer):

  class Meta:
    model = Comment
    fields=[#'user',
            #'ip_address',
            'post', 'content' ]

    def validate_content(self, content):
      content = content.strip()
      if len(content) == 0:
        raise ValidationError("Content length is 0")

      return content