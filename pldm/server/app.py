import os
import hashlib
import time
from datetime import datetime, timedelta

import elasticsearch
import redis

from jinja2 import Environment, FileSystemLoader, TemplateNotFound

from tornado import web
from tornado import template

from pldm.server.chrome import IndexHandler
from pldm.server.documents import (ViewDocumentHandler, EditDocumentHandler, 
    CreateDocumentHandler, ListDocumentsHandler)
from pldm.server.session import RedisSessionStore

from pldm.storage.filesystem import FileSystemDocumentStore
from pldm import builtin_types
from pldm.server import api


class Application(web.Application):
    def __init__(self, **kwargs):
        base_dir = os.path.dirname(__file__)
        static_path = os.path.join(base_dir, '..', 'static')
        template_dir = os.path.join(base_dir, '..', 'templates')
        kwargs.update({
            'handlers': [
                web.URLSpec(r"/", IndexHandler),
                web.URLSpec(r"/list/", ListDocumentsHandler, name='list-documents'),
                web.URLSpec(r"/view/(?P<uid>[^/]+)/", ViewDocumentHandler, name='view-document'),
                web.URLSpec(r"/edit/(?P<uid>[^/]+)/", EditDocumentHandler, name='edit-document'),
                web.URLSpec(r"/create/", CreateDocumentHandler, name='create-document'),
                web.URLSpec(r"/static/(.*)", web.StaticFileHandler, {'path': static_path}),
                
                web.URLSpec(r"/api/documents/", api.DocumentsHandler, name='api-search'),
                web.URLSpec(r"/api/document/(?P<uid>[^/]+)/", api.DocumentHandler, name='api-details'),
            ],
            'template_loader': template.Loader(template_dir)
        })
        super(Application, self).__init__(**kwargs)
        
        self.redis = redis.StrictRedis()
        self.session_store = RedisSessionStore(self.redis)
        self.jinja_env = Environment(loader=FileSystemLoader([template_dir]))
        self.manager = FileSystemDocumentStore(
            es = elasticsearch.Elasticsearch(),
            root_dir='./_documents',
            redis=self.redis, 
            default_type=builtin_types.Ticket,
            default_project='pldm',
        )
        self.manager.register(builtin_types.Ticket)
        self.manager.register(builtin_types.Feature)
        self.manager.register(builtin_types.Bug)
        self.manager.register(builtin_types.Story)
        self.manager.register(builtin_types.Project)
        self.manager.register(builtin_types.User)





