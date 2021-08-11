from django.db import models
import uuid
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator
from vote.models import VoteModel   #https://github.com/shellfly/django-vote
from .utils import PathAndRename

from backend.settings import ALLOWED_VIDEO_FORMATS, ALLOWED_IMAGE_FORMATS, USER_CONTENT_SAVE_PATH


class Post(VoteModel, models.Model):
    """class to represent posts"""
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    file = models.FileField(upload_to=PathAndRename(USER_CONTENT_SAVE_PATH),
                            validators=[
                                FileExtensionValidator(
                                    allowed_extensions=ALLOWED_IMAGE_FORMATS + ALLOWED_VIDEO_FORMATS)])
    thumbnail = models.ImageField(null=True, blank=True)
    tags = models.ManyToManyField('Tag', blank=True)

    VIDEO = 'vid'
    IMAGE = 'img'
    MEDIA_CHOICES = [
        (VIDEO, 'Video'),
        (IMAGE, 'Image'),
    ]
    media_type = models.CharField(
        max_length=3,
        choices=MEDIA_CHOICES,
        default=IMAGE
    )

    def set_media_type(self):
        ext = self.file.name.split('.')[-1]
        if ext in ALLOWED_IMAGE_FORMATS:
            self.media_type = self.IMAGE
        else:
            self.media_type = self.VIDEO


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()
    content = models.CharField(max_length=3000)


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.content
