from StringIO import StringIO
import abc
import logging
import re

import elasticsearch

from pldm.exceptions import DocumentDoesNotExist, ReferenceLookupError
from pldm.documents import parse_document


logger = logging.getLogger(__name__)


class BaseDocumentStore(object):
    __metaclass__ = abc.ABCMeta

    def __init__(self, redis=None, es=None, default_type=None, default_project=None, index_name='pldm'):
        self.redis = redis
        self.es = es
        self.index_name = index_name
        self.default_type = default_type
        self.default_project = default_project
        self.doctypes = {}
        if not self.es.indices.exists(index=self.index_name):
            self.es.indices.create(index=self.index_name)

    @abc.abstractmethod
    def save_raw(self, data):
        pass

    @abc.abstractmethod
    def get_from_storage(self, uid):
        pass

    def get_from_index(self, uid):
        try:
            data = self.es.get(
                index=self.index_name,
                id=uid,
            )
            return self.deserialize(data['_source'])
        except elasticsearch.NotFoundError:
            raise DocumentDoesNotExist()

    def get(self, uid):
        try:
            return self.get_from_index(uid)
        except DocumentDoesNotExist:
            logger.info('failed to get document from index, trying storage instead (uid=%s).', uid)
        doc = self.get_from_storage(uid)
        self.index(doc)
        return doc
        
    def index(self, doc):
        self.es.index(
            id=doc.uid,
            index=self.index_name,
            doc_type=doc.type_name,
            body=doc.serialize(),
        )

    def register(self, doctype):
        self.doctypes[doctype.type_name] = doctype

    def get_next_number(self, parent=None):
        return self.redis.incr('last_number:__global__')
        
    def reset_numbering(self, parent=None):
        self.redis.set('last_number:__global__', 0)

    def _get_type(self, data):
        type_name = data.get('Type')
        return self.doctypes.get(type_name, self.default_type)

    def deserialize(self, data):
        doctype = self._get_type(data)
        doc = doctype.deserialize(self, data)
        return doc
    
    def loads(self, text):
        return self.load(StringIO(text))

    def load(self, f):
        headers, body = parse_document(f)
        doctype = self._get_type(headers)
        doc = doctype(self, headers, body=body)
        return doc

    def save(self, doc):
        doc.store = self
        parent = doc.get_parent() or '__root__'
        if hasattr(doc, 'number') and not doc.get_number():
            doc.number = self.get_next_number(parent)
        self.save_raw(doc)
        self.index(doc)
        
    def get_path(self, doc):
        path = []
        parent = doc.get_parent()
        while parent:
            print parent
            path.insert(0, parent)
            parent = parent.get_parent()
        return path

    def resolve_reference(self, ref):
        if not ref:
            return None
        try:
            if ref.startswith('#'):
                return self.lookup('Number', ref[1:])
            if re.match('[0-9a-f]+', ref):
                return self.get(ref)
            if ref.startswith('@'):
                return self.lookup('Name', ref[1:], doctype='User')
            return self.lookup('Name', ref)
        except DocumentDoesNotExist:
            pass
        raise ReferenceLookupError(ref)

    def search(self, query='', doctype=None, limit=50):
        body = {}
        if query:
            body = {
                'query': {
                    'query_string': {
                        'query': query,
                    }
                }
            }
        result = self.es.search(
            size=limit,
            index=self.index_name,
            body=body,
        )
        for hit in result['hits']['hits']:
            yield self.deserialize(hit['_source'])

    def lookup(self, key, value, doctype=''):
        es_filter = {
            'term': {
                key: value,
            }
        }
        result = self.es.search(
            index=self.index_name,
            size=2,
            doc_type=doctype,
            body={'filter': es_filter},
        )
        hits = result['hits']['hits']
        if not hits:
            raise DocumentDoesNotExist()
        return self.deserialize(hits[0]['_source'])
