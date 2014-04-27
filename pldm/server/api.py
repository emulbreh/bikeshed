import json
from io import StringIO

from patchit import PatchSet
from tornado.web import HTTPError

from pldm.server.base import BaseHandler


class BaseDocumentHandler(BaseHandler):
    def serialize_document(self, doc, compact=False):
        data = {
            'type': doc.type_name,
            'uid': doc.uid,
            'url': '/api/document/%s/' % doc.uid,
            'label': doc.get_label(),
            'title': doc.get_title(),
        }
        if not compact:
            html_tpl = self.application.jinja_env.get_template('document.snippet.html')
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
            path = self.application.store.get_path(doc)
            data.update({
                'text': doc.dumps(include_hidden=True),
                'html': html_tpl.render({'document': doc}),
                'body': doc.body,
                'html_body': doc.html_body(),
                'headers': headers,
                'path': [self.serialize_document(d, compact=True) for d in path]
            })
        return data


class DocumentHandler(BaseDocumentHandler):
    @property
    def document(self):
        if not hasattr(self, '_document'):
            uid = self.path_kwargs.get('uid')
            self._document = self.application.store.get(uid)
        return self._document

    def apply_update(self):
        data = json.loads(self.request.body)
        self.document.update(data)

    def return_document(self):
        self.write(self.serialize_document(self.document))

    def get(self, uid):
        self.return_document()

    def put(self, uid):
        content_type = self.request.headers['Content-Type']
        if content_type == 'application/json':
            self.document.clear()
            self.apply_update()
        elif content_type == 'text/plain':
            try:
                body = self.request.body.decode('utf-8')
            except UnicodeDecodeError:
                self.set_status(400)
            self.document.loads(body)
        else:
            self.set_status(400)
            return
        self.application.store.save(self.document)
        self.return_document()

    def patch(self, uid):
        content_type = self.request.headers['Content-Type']
        if content_type == 'application/json':
            self.apply_update()
        elif content_type == 'text/plain':
            patches = PatchSet.from_stream(StringIO(self.request.body))
            lines = self.document.dumps().splitlines()
            for patch in patches:
                # FIXME: does more than one patch make sense?
                lines = patch.merge(lines)
            self.document.loads('\n'.join(lines))
        else:
            self.set_status(400)
        self.application.store.save(self.document)
        self.return_document()


class DocumentsHandler(BaseDocumentHandler):
    def get(self):
        q = self.get_argument('q', '')
        t = self.get_argument('type', '')
        limit = self.get_argument('limit', 20)
        offset = self.get_argument('offset', 0)
        result = self.application.store.search(
            query=q,
            doctype=t,
            limit=limit,
            offset=offset,
        )
        self.content_type = 'application/json'
        self.write({
            'documents': [self.serialize_document(doc) for doc in result],
        })

    def post(self):
        content_type = self.request.headers['Content-Type']
        if content_type == 'application/json':
            data = json.loads(self.request.body)
            doc = self.application.store.create(data)
        elif content_type == 'text/plain':
            try:
                body = self.request.body.decode('utf-8')
            except UnicodeDecodeError:
                self.set_status(400)
            doc = self.application.store.loads(body)
        else:
            self.set_status(400)
            return
        self.application.store.save(doc)
        self.write(self.serialize_document(doc))
