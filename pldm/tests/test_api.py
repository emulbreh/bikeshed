import random
import tempfile
import shutil
import json

import elasticsearch
import redis
from tornado import testing

from pldm.server.app import Application
from pldm.storage.filesystem import FileSystemDocumentStore
from pldm import builtin_types


class ApiTestCase(testing.AsyncHTTPTestCase):
    def setUp(self):
        self.tmp_document_dir = tempfile.mkdtemp()
        store = FileSystemDocumentStore(
            es=elasticsearch.Elasticsearch(),
            root_dir=self.tmp_document_dir,
            redis=redis.StrictRedis(),
            default_type=builtin_types.Ticket,
            default_project='pldm-test',
            index_name='pldm-test-%x' % random.getrandbits(32),
        )
        store.register(builtin_types.Ticket)
        store.register(builtin_types.Feature)
        store.register(builtin_types.Bug)
        store.register(builtin_types.Story)
        store.register(builtin_types.Project)
        store.register(builtin_types.User)
        self.store = store
        store.create_index()
        self._app = Application(store)
        super(ApiTestCase, self).setUp()
        
    def tearDown(self):
        super(ApiTestCase, self).tearDown()
        self.store.delete_index()
        shutil.rmtree(self.tmp_document_dir)

    def get_app(self):
        return self._app


class DocumentSearchTests(ApiTestCase):
    def test_empty_search(self):
        self.http_client.fetch(self.get_url('/api/documents/'), self.stop)
        response = self.wait()
        self.assertEqual(json.loads(response.body), {'documents': []})


class DocumentDetailsTests(ApiTestCase):
    def test_get_document_json(self):
        pass
    