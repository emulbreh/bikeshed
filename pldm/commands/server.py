import sys
import logging

import tornado.ioloop
import tornado.autoreload

import elasticsearch
import redis

from pldm.server.app import Application
from pldm.storage.filesystem import FileSystemDocumentStore
from pldm import builtin_types


logger = logging.getLogger()

if __name__ == '__main__':
    store = FileSystemDocumentStore(
        es=elasticsearch.Elasticsearch(),
        root_dir='./_documents',
        redis=redis.StrictRedis(),
        default_type=builtin_types.Ticket,
        default_project='pldm',
    )
    store.register(builtin_types.Ticket)
    store.register(builtin_types.Feature)
    store.register(builtin_types.Bug)
    store.register(builtin_types.Story)
    store.register(builtin_types.Project)
    store.register(builtin_types.User)
    
    logger.setLevel(logging.INFO)
    app = Application(store)
    app.listen(7001)
    ioloop = tornado.ioloop.IOLoop.instance()
    tornado.autoreload.start(io_loop=ioloop)
    ioloop.start()

