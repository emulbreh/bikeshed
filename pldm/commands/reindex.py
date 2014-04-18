import sys
import logging
import time

from pldm.server.app import Application


logger = logging.getLogger()

renumber = True

if __name__ == '__main__':
    logger.setLevel(logging.DEBUG)
    app = Application()
    app.store.delete_index()
    app.store.create_index()
    renumber = '--renumber' in sys.argv
    if renumber:
        app.store.reset_numbering()

    for doc in app.store.list(ignore_reference_errors=True):
        app.store.index(doc)

    time.sleep(1)  # FIXME: wait for index to catch up

    for doc in app.store.list():
        if renumber and hasattr(doc, 'number'):
            doc.number = None
            app.store.save(doc)
        else:
            app.store.index(doc)
