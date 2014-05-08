import sys
import logging
import time

from bikeshed.server.app import Application
from bikeshed.commands.base import get_store


logger = logging.getLogger()

renumber = True

if __name__ == '__main__':
    logger.setLevel(logging.DEBUG)
    store = get_store()
    store.delete_index()
    store.create_index()
    renumber = '--renumber' in sys.argv
    if renumber:
        store.reset_numbering()

    for doc in store.list(ignore_reference_errors=True):
        store.index(doc)

    time.sleep(1)  # FIXME: wait for index to catch up

    for doc in store.list():
        if renumber and hasattr(doc, 'number'):
            doc.number = None
            store.save(doc)
        else:
            store.index(doc)
