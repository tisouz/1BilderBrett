import os, uuid, magic

from backend.settings import ALLOWED_IMAGE_FORMATS, ALLOWED_VIDEO_FORMATS

from django.conf import settings
from django.utils.deconstruct import deconstructible
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


@deconstructible
class PathAndRename(object):

    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        # set filename as random string
        filename = '{}.{}'.format(uuid.uuid4().hex, ext)
        # return the whole path to the file
        return os.path.join(self.path, filename)


def filetype_is_valid(upload):
    """checks if the MIME type of an upload is allowed and correct"""
    # temporarly save the file
    tmp_path = 'tmp/' + upload.name[2:]
    default_storage.save(tmp_path, ContentFile(upload.file.read()))
    full_tmp_path = os.path.join(settings.MEDIA_ROOT, tmp_path)
    # get type and delete file
    # magic uses '/' as seperator
    file_type = magic.from_file(full_tmp_path, mime=True).split('/')[-1]
    default_storage.delete(tmp_path)
    # check valid mime type
    if file_type not in ALLOWED_IMAGE_FORMATS and file_type not in ALLOWED_VIDEO_FORMATS:
        return False
    # check if extension matches
    ext = upload.name.split('.')[-1]
    # magic uses jpeg instead of jpg
    if ext == 'jpg':
        ext = 'jpeg'
    if ext != file_type:
        return False
    return True