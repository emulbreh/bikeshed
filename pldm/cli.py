import sys
import logging

import tornado.ioloop
import tornado.autoreload

from pldm.server.app import Application


logger = logging.getLogger()

if __name__ == '__main__':
    logger.setLevel(logging.DEBUG)
    app = Application()
    app.listen(7001)
    ioloop = tornado.ioloop.IOLoop.instance()
    tornado.autoreload.start(io_loop=ioloop)
    ioloop.start()

