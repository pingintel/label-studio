import os
from django.apps import AppConfig


class KhanConfig(AppConfig):
    name = 'khan'
    path = os.path.normpath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'khan'))

