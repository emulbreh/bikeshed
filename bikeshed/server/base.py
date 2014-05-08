from tornado.web import RequestHandler

from bikeshed.server.session import Session


BIKESHED_SESSION_COOKIE = 'bikeshed-session'


class BaseHandler(RequestHandler):
    def render_template(self, template_name, **ctx):
        template = self.application.jinja_env.get_template(template_name)
        self.write(template.render(ctx))

    @property
    def session(self):
        session_id = self.get_secure_cookie(BIKESHED_SESSION_COOKIE)
        if session_id is None:
            session_id = self.application.session_store.generate_sid()
            self.set_secure_cookie(BIKESHED_SESSION_COOKIE)
        return Session(self.application.session_store, session_id)
