import json

from tornado.web import HTTPError

from pldm.server.base import BaseHandler


class DocumentHandler(BaseHandler):
    @property
    def document(self):
        if not hasattr(self, '_document'):
            uid = self.path_kwargs.get('uid')
            self._document = self.application.manager.get(uid)
        return self._document


class DocumentsHandler(BaseHandler):
    def get(self):
        q = self.get_argument('q', '')
        result = self.application.manager.search(query=q)
        self.content_type = 'application/json'
        self.write({
            'documents': [doc.serialize() for doc in result],
        })
