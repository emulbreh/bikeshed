import os
import hashlib
import time
import uuid

from tornado.web import RequestHandler, HTTPError, removeslash
from tornado.gen import coroutine, Return

from pldm.server.base import BaseHandler


class DocumentHandler(BaseHandler):
    @property
    def document(self):
        if not hasattr(self, '_document'):
            uid = self.path_kwargs.get('uid')
            self._document = self.application.manager.get(uid)
        return self._document


class ViewDocumentHandler(DocumentHandler):
    def get(self, uid=None):
        log = [] #self.application.repository.get_log(self.document.path)
        self.render_template('documents/view.html',
            document=self.document,
            path=self.application.manager.get_path(self.document),
        )


class EditDocumentHandler(DocumentHandler):
    @coroutine
    def get(self, uid=None):
        self.render_template('documents/edit.html',
            document=self.document, 
            path=self.application.manager.get_path(self.document),
            text=self.document.dumps(include_hidden=True),
        )

    @coroutine
    def post(self, uid=None):
        doc = self.document
        doc.loads(self.get_body_argument('text'))
        self.application.manager.save(doc)
        self.redirect(self.reverse_url('view-document', doc.uid))


class CreateDocumentHandler(BaseHandler):
    @coroutine
    def get(self):
        self.render_template('documents/create.html')

    @coroutine
    def post(self):
        doc = self.application.manager.loads(self.get_argument('text'))
        self.application.manager.save(doc)
        self.redirect(self.reverse_url('view-document', doc.uid))


class ListDocumentsHandler(BaseHandler):
    def get(self):
        q = self.get_argument('q', '')
        result = list(self.application.manager.search(query=q))
        self.render_template('documents/list.html', documents=result, q=q)
