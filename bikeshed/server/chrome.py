from bikeshed.server.base import BaseHandler


class IndexHandler(BaseHandler):
    needs_authentication = False

    def get(self):
        self.render_template('index.html')

