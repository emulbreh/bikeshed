import sys
import logging

import tornado.ioloop
import tornado.autoreload

from pldm.server.app import Application


logger = logging.getLogger()

renumber = True

if __name__ == '__main__':
    logger.setLevel(logging.DEBUG)
    app = Application()
    renumber = '--renumber' in sys.argv
    if renumber:
        app.manager.reset_numbering()
    for doc in app.manager.list():
        if renumber and hasattr(doc, 'number'):
            doc.number = None
            app.manager.save(doc)
        else:
            app.manager.index(doc)
