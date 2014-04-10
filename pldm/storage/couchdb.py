from __future__ import absolute_import
import couchquery

from pldm.storage.base import BaseDocumentStore
from pldm.exceptions import DocumentDoesNotExist


class CouchDBDocumentStore(BaseDocumentStore):
    def __init__(self, db=None, **kwargs):
        super(CouchDBDocumentStore, self).__init__(**kwargs)
        self.db = db

    def get_from_storage(self, uid):
        try:
            data = self.db.get(uid)
        except couchquery.CouchDBDocumentDoesNotExist:
            raise DocumentDoesNotExist()
        return self.deserialize(data)

    def save_raw(self, doc):
        response = self.db.save(doc.serialize())
        doc.uid = response['id']
        doc.revision = response['rev']

    def list(self):
        for data in self.db.views.all(include_docs=True):
            doctype = self._get_type(data)
            yield doctype.deserialize(data)


