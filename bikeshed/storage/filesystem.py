from __future__ import absolute_import

import io
import os
import uuid

from bikeshed.storage.base import BaseDocumentStore
from bikeshed.exceptions import DocumentDoesNotExist


class FileSystemDocumentStore(BaseDocumentStore):
    def __init__(self, root_dir=None, **kwargs):
        super(FileSystemDocumentStore, self).__init__(**kwargs)
        self.root_dir = root_dir

    def _get_document_path(self, uid):
        return os.path.join(self.root_dir, '%s.txt' % uid)

    def get_from_storage(self, uid):
        path = self._get_document_path(uid)
        if not os.path.exists(path):
            raise DocumentDoesNotExist()
        with io.open(path, 'r', encoding='utf-8') as f:
            doc = self.load(f)
        doc.uid = uid
        return doc

    def save_raw(self, doc):
        uid = doc.uid if doc.uid else uuid.uuid4().get_hex()
        path = self._get_document_path(uid)
        with io.open(path, 'w', encoding='utf-8') as f:
            doc.dump(f, include_hidden=True, include_readonly=True, include_invisible=True)
        doc.uid = uid
        doc.revision = 1

    def list(self, ignore_reference_errors=False):
        for name in os.listdir(self.root_dir):
            if not name.endswith('.txt'):
                continue
            uid = name[:-4]
            path = self._get_document_path(uid)
            with io.open(path, 'r', encoding='utf-8') as f:
                doc = self.load(f, ignore_reference_errors=ignore_reference_errors)
                doc.uid = uid
                yield doc




