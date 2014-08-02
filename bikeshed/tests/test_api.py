import random
import tempfile
import shutil
import time
import json
import unittest

import elasticsearch
import redis

from werkzeug.test import Client
from werkzeug.wrappers import BaseResponse

from bikeshed.server.app import WsgiApplication
from bikeshed.storage.filesystem import FileSystemDocumentStore
from bikeshed import builtin_types
from bikeshed.auth import create_session_key


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.tmp_document_dir = tempfile.mkdtemp()
        store = FileSystemDocumentStore(
            es=elasticsearch.Elasticsearch(),
            root_dir=self.tmp_document_dir,
            redis=redis.StrictRedis(),
            default_type=builtin_types.Ticket,
            default_project='bikeshed-test',
            index_name='bikeshed-test-%x' % random.getrandbits(32),
        )
        store.register(builtin_types.Ticket)
        store.register(builtin_types.Feature)
        store.register(builtin_types.Bug)
        store.register(builtin_types.Story)
        store.register(builtin_types.Project)
        store.register(builtin_types.User)
        self.store = store
        store.create_index()
        time.sleep(1)  # FIXME

        store.es.cluster.health(wait_for_nodes=1)
        self.app = WsgiApplication(store=store)
        self.client = Client(self.app, BaseResponse)
        super(ApiTestCase, self).setUp()

    def tearDown(self):
        self.store.delete_index()
        shutil.rmtree(self.tmp_document_dir)


class DocumentSearchTests(ApiTestCase):
    def test_empty_search(self):
        response = self.client.get('/api/documents/', headers={
            'Authorization': 'session %s' % create_session_key('0')
        })
        self.assertEqual(json.loads(response.data), {'documents': []})


class DocumentDetailsTests(ApiTestCase):
    def test_get_document_json(self):
        pass
