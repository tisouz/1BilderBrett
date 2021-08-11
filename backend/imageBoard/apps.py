from django.apps import AppConfig

class ImageBoard(AppConfig):
    name = 'imageBoard'
    def ready(self):
        #connect handlers
        import imageBoard.signals.handlers
        # create tmp and thumbnail folders if they don't exist
        from django.conf import settings
        import pathlib
        import os
        if pathlib.Path(settings.MEDIA_ROOT).exists() == False:
            print(f'creating {settings.MEDIA_ROOT}')
            os.mkdir(settings.MEDIA_ROOT)
        if pathlib.Path(settings.THUMBNAIL_DIR).exists() == False:
            print(f'creating {settings.THUMBNAIL_DIR}')
            os.mkdir(settings.THUMBNAIL_DIR)
        if pathlib.Path(settings.TMP_DIR).exists() == False:
            print(f'creating {settings.TMP_DIR}')
            os.mkdir(settings.TMP_DIR)
