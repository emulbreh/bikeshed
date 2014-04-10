import json

from tornado.web import HTTPError

from pldm.server.base import BaseHandler


def serialize_document(doc):
    data = doc.serialize()
    data.update(
        url='/api/document/%s/' % doc.uid,
        html_body=doc.html_body(),
    )
    return data


class DocumentHandler(BaseHandler):
    @property
    def document(self):
        if not hasattr(self, '_document'):
            uid = self.path_kwargs.get('uid')
            self._document = self.application.manager.get(uid)
        return self._document
        
    def get(self, uid):
        self.write(serialize_document(self.document))


class DocumentsHandler(BaseHandler):
    def get(self):
        q = self.get_argument('q', '')
        result = self.application.manager.search(query=q)
        self.content_type = 'application/json'
        self.write({
            'documents': [serialize_document(doc) for doc in result],
        })
