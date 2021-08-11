import os
from django.db import models
from django.dispatch import receiver
from django.conf import settings
from imageBoard.models import Post

import cv2
import subprocess


@receiver(models.signals.post_delete, sender=Post)
def auto_delete_file_on_delete(instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `Upload` object is deleted.
    """
    print("called auto_delete_File_on_delete handerl")
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

@receiver(models.signals.post_delete, sender=Post)
def auto_delete_thumbnail_on_delete(instance, **kwargs):
    """
    Deletes thumbanil from filesystem
    when corresponding 'Upload' object is deleted.
    """
    if instance.thumbnail:
        if os.path.isfile(instance.thumbnail.path):
            os.remove(instance.thumbnail.path)

@receiver(models.signals.post_save, sender=Post)
def auto_create_thumbnail(instance, **kwargs):
    """
    Creates a thumbnail image, when a 'Upload' object is created.
    """
    if instance.thumbnail != None:
        print("thumbnail already created")
        return

    instance.set_media_type()
    initial_path = instance.file.path
    initial_file_name = initial_path.split(os.sep)[-1]
    initial_file_name_no_ext = initial_file_name.split('.')[0]

    save_dir = settings.THUMBNAIL_DIR.split(os.sep)[-1]
    print(f'save_dir: {save_dir}')

    save_file_name = initial_file_name_no_ext + '.jpg'
    file_path = os.path.join(settings.THUMBNAIL_DIR, save_file_name)

    height = 128
    width = 128
    dim = (width, height)

    if instance.media_type == instance.IMAGE:
        img = cv2.imread(initial_path, cv2.IMREAD_UNCHANGED)
        thumbnail = cv2.resize(img, dim)
        # create thumbnail directory if it doesn't exist
        cv2.imwrite(file_path, thumbnail)
    else:
        tmp_pic_path = os.path.join(settings.TMP_DIR, 'thumbtemp.jpg')
        print(tmp_pic_path)
        subprocess.call(['ffmpeg', '-i', initial_path, '-ss', '00:00:00.000', '-vframes', '1', tmp_pic_path])
        img = cv2.imread(tmp_pic_path)
        thumbnail = cv2.resize(img, dim)
        cv2.imwrite(file_path, thumbnail)
        os.remove(tmp_pic_path)

    instance.thumbnail = settings.THUMBNAIL_DIR.split(os.sep)[-1] + '/' + save_file_name
    instance.save()
