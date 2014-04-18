import sys
import logging

from pldm.server.app import Application


logger = logging.getLogger()

if __name__ == '__main__':
    logger.setLevel(logging.DEBUG)
    app = Application()
    app.store.create_index()