import sys
import logging
import time

from pldm.server.app import Application


logger = logging.getLogger()

renumber = True

if __name__ == '__main__':
    logger.setLevel(logging.DEBUG)
    app = Application()
    app.manager.delete_index()
    app.manager.create_index()
    renumber = '--renumber' in sys.argv
    if renumber:
        app.manager.reset_numbering()

    for doc in app.manager.list(ignore_reference_errors=True):
        app.manager.index(doc)

    time.sleep(1)  # FIXME: wait for index to catch up

    for doc in app.manager.list():
        if renumber and hasattr(doc, 'number'):
            doc.number = None
            app.manager.save(doc)
        else:
            app.manager.index(doc)
