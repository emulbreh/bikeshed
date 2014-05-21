import json
from io import StringIO

from patchit import PatchSet

from bikeshed.server.base import BaseHandler
from bikeshed.exceptions import DocumentDoesNotExist
from bikeshed.auth import hash_password, create_session_key


class BaseDocumentHandler(BaseHandler):
    def serialize_document(self, doc, compact=False):
        data = {
            'type': doc.type_name,
            'uid': doc.uid,
            'url': '/api/documents/%s/' % doc.uid,
            'label': doc.get_label(),
            'title': doc.get_title(),
        }
        if not compact:
            html_tpl = self.app.jinja_env.get_template('document.snippet.html')
            headers = []
            for header in doc.headers:
                value = header.get(doc)
                if not value:
                    continue
                headers.append({
                    'key': header.key,
                    'value': header.serialize(doc, value),
                    'well_known': True,
                })
            for key, value in doc.extra_header_values.iteritems():
                headers.append({
                    'key': key,
                    'value': value,
                    'well_known': False,
                })
            path = self.app.store.get_path(doc)
            data.update({
                'text': doc.dumps(include_hidden=True),
                'html': html_tpl.render({'document': doc}),
                'body': doc.body,
                'html_body': doc.html_body(),
                'headers': headers,
                'path': [self.serialize_document(d, compact=True) for d in path]
            })
        return data


class AuthenticationHandler(BaseDocumentHandler):
    needs_authentication = False

    def post(self):
        data = json.loads(self.request.data)
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return self.error_response(400)
        try:
            user = self.app.store.lookup('Name', username, doctype='User')
        except DocumentDoesNotExist:
            return self.error_response(401)
        hashed_password = user['Password']
        if user['Password'] != hash_password(password.encode('utf-8'), hashed_password.encode('utf-8')):
            return self.error_response(401)
        return self.json_response({
            'session_key': create_session_key(user.uid),
            'user': self.serialize_document(user, compact=True)
        })


class DocumentHandler(BaseDocumentHandler):
    @property
    def document(self):
        if not hasattr(self, '_document'):
            uid = self.params.get('uid')
            self._document = self.app.store.get(uid)
        return self._document

    def apply_update(self):
        headers = json.loads(self.request.data)
        self.document.update_headers(headers)

    def document_response(self):
        return self.json_response(self.serialize_document(self.document))

    def get(self):
        return self.document_response()

    def put(self):
        mimetype = self.request.mimetype
        if mimetype == 'application/json':
            self.document.clear()
            self.apply_update()
        elif mimetype == 'text/plain':
            try:
                body = self.request.data.decode('utf-8')
            except UnicodeDecodeError:
                return self.error_response(400, 'unicode decode error')
            self.document.loads(body)
        else:
            return self.error_response(400)
        self.app.store.save(self.document)
        return self.document_response()

    def patch(self, uid):
        mimetype = self.request.mimetype
        if mimetype == 'application/json':
            self.apply_update()
        elif mimetype == 'text/plain':
            patches = PatchSet.from_stream(StringIO(self.request.data))
            lines = self.document.dumps().splitlines()
            for patch in patches:
                # FIXME: does more than one patch make sense?
                lines = patch.merge(lines)
            self.document.loads('\n'.join(lines))
        else:
            return self.error_response(400)
        self.app.store.save(self.document)
        return self.document_response()


class DocumentsHandler(BaseDocumentHandler):
    def get(self):
        q = self.request.args.get('q', '')
        t = self.request.args.get('type', '')
        limit = self.request.args.get('limit', 20)
        offset = self.request.args.get('offset', 0)
        result = self.app.store.search(
            query=q,
            doctype=t,
            limit=limit,
            offset=offset,
        )
        self.content_type = 'application/json'
        return self.json_response({
            'documents': [self.serialize_document(doc) for doc in result],
        })

    def post(self):
        mimetype = self.request.mimetype
        if mimetype == 'application/json':
            data = json.loads(self.request.data)
            doc = self.app.store.create(data)
        elif mimetype == 'text/plain':
            try:
                body = self.request.data.decode('utf-8')
            except UnicodeDecodeError:
                return self.error_response(400, 'unicode decode error')
            doc = self.app.store.loads(body)
        else:
            return self.error_response(400, 'bad mimetype: %s' % mimetype)
        self.app.store.save(doc)
        return self.json_response(self.serialize_document(doc))


class HistogramHandler(BaseHandler):
    def get(self):
        q = self.request.args.get('q', '')
        field = self.request.args.get('field', '')
        interval = self.request.args.get('interval')
        if not field:
            return self.error_response(400, "'field' parameter is required")
        r = self.app.store.histogram(field, interval=interval)
        return self.json_response({'histogram': r})
