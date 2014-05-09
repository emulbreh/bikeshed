from tornado.web import RequestHandler

from bikeshed.server.session import Session
from bikeshed.auth import clean_session_key


BIKESHED_SESSION_COOKIE = 'bikeshed-session'


class BaseHandler(RequestHandler):
    needs_authentication = True

    def prepare(self):
        super(BaseHandler, self).prepare()
        self.user_uid = None
        auth = self.request.headers.get('Authorization', '')
        session_key = auth.split(' ', 1)[-1]
        try:
            self.user_uid = clean_session_key(session_key)
        except ValueError:
            if self.needs_authentication:
                self.send_error(401)

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
