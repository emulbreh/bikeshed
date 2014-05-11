from werkzeug.wrappers import Response
from bikeshed.server.base import BaseHandler


class IndexHandler(BaseHandler):
    needs_authentication = False

    def get(self):
        return self.render_template('index.html')


class VoidHandler(BaseHandler):
    needs_authentication = False

    def get(self):
        return Response('')

    def post(self):
        return Response('')

