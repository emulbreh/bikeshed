from pldm.server.base import BaseHandler


class IndexHandler(BaseHandler):
    def get(self):
        self.render_template('index.html')

