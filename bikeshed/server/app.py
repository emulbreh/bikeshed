import hashlib
import time
from datetime import datetime, timedelta

from jinja2 import Environment, FileSystemLoader, TemplateNotFound

from werkzeug.wrappers import Request, Response
from werkzeug.routing import Map, Rule
from werkzeug.exceptions import HTTPException, NotFound

from bikeshed.server.chrome import IndexHandler, VoidHandler
from bikeshed.server import api


class WsgiApplication(object):
    url_map = Map([
        #Rule(r'/events', endpoint='events'),
        Rule(r"/api/authenticate/", endpoint=api.AuthenticationHandler),
        Rule(r"/api/documents/", endpoint=api.DocumentsHandler),
        Rule(r"/api/documents/<uid>/", endpoint=api.DocumentHandler),
        Rule(r"/api/histogram/", endpoint=api.HistogramHandler),
        Rule(r"/void/", endpoint=VoidHandler),
        Rule(r"/", endpoint=IndexHandler),
        Rule(r"/<path:path>", endpoint=IndexHandler),
    ])

    def __init__(self, store=None, redis=None, template_dir=None):
        self.redis = redis
        self.jinja_env = Environment(loader=FileSystemLoader([template_dir]))
        self.store = store

    def __call__(self, environ, start_response):
        request = Request(environ)
        adapter = self.url_map.bind_to_environ(environ)
        try:
            endpoint, values = adapter.match()
            handler = endpoint(self, request, values)
            response = handler()
        except HTTPException as e:
            return e
        return response(environ, start_response)

