import sys
import logging

import tornado.ioloop
import tornado.autoreload

from bikeshed.server.app import Application
from bikeshed.commands.base import get_store


logger = logging.getLogger()

if __name__ == '__main__':
    logger.setLevel(logging.INFO)
    app = Application(get_store())
    app.listen(7001)
    ioloop = tornado.ioloop.IOLoop.instance()
    tornado.autoreload.start(io_loop=ioloop)
    ioloop.start()

