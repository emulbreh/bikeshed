import sys
import logging

from bikeshed.commands.base import get_store


logger = logging.getLogger()

if __name__ == '__main__':
    logger.setLevel(logging.DEBUG)
    get_store().create_index()
