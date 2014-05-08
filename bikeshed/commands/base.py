import elasticsearch
import redis

from bikeshed.storage.filesystem import FileSystemDocumentStore
from bikeshed import builtin_types


def get_store():
    store = FileSystemDocumentStore(
        es=elasticsearch.Elasticsearch(),
        root_dir='./_documents',
        redis=redis.StrictRedis(),
        default_type=builtin_types.Ticket,
        default_project='bikeshed',
    )
    store.register(builtin_types.Ticket)
    store.register(builtin_types.Feature)
    store.register(builtin_types.Bug)
    store.register(builtin_types.Story)
    store.register(builtin_types.Project)
    store.register(builtin_types.User)
    return store
