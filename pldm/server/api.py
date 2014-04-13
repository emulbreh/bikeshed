import json

from tornado.web import HTTPError

from pldm.server.base import BaseHandler


def serialize_document(doc):
    headers = []
    for header in doc:
        if not header.value:
            continue
        headers.append({
            'key': header.attribute.key,
            'value': header.attribute.serialize(header.value),
            'well_known': True,
        })
    for key, value in doc.extra_attributes.iteritems():
        headers.append({
            'key': key,
            'value': value,
            'well_known': False,
        })
    return {
        'type': doc.type_name,
        'headers': headers,
        'uid': doc.uid,
        'url': '/api/document/%s/' % doc.uid,
        'body': doc.body,
        'html_body': doc.html_body(),
    }


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
        t = self.get_argument('type', '')
        limit = self.get_argument('limit', 20)
        offset = self.get_argument('offset', 0)
        result = self.application.manager.search(
            query=q, 
            doctype=t, 
            limit=limit,
            offset=offset,
        )
        self.content_type = 'application/json'
        self.write({
            'documents': [serialize_document(doc) for doc in result],
        })
