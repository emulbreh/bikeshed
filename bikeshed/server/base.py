import json
from werkzeug.wrappers import Response

from bikeshed.auth import clean_session_key


class RequestHandler(object):
    def __init__(self, app, request, params):
        self.app = app
        self.request = request
        self.params = params

    def __call__(self):
        method = getattr(self, self.request.method.lower())
        return method()


class BaseHandler(RequestHandler):
    needs_authentication = True

    def json_response(self, data, status=200):
        return Response(json.dumps(data), status=status, content_type='application/json')

    def error_response(self, status=500, msg='something went wrong', extra=None):
        data = {'error': msg}
        if extra:
            data.update(extra)
        return self.json_response(data, status=status)

    def bad_mimetype_response(self):
        return self.error_response(
            status=400,
            msg='bad mimetype',
            extra={'mimetype': self.request.mimetype}
        )

    def __call__(self):
        self.user_uid = None
        auth = self.request.headers.get('Authorization', '')
        session_key = auth.split(' ', 1)[-1]
        try:
            self.user_uid = clean_session_key(session_key)
        except ValueError:
            if self.needs_authentication:
                return self.error_response(401, 'authorization required')
        return super(BaseHandler, self).__call__()

    def render_template(self, template_name, **ctx):
        template = self.app.jinja_env.get_template(template_name)
        return Response(template.render(ctx), content_type='text/html')
