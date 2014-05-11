import os
from redis import StrictRedis

from werkzeug.wsgi import SharedDataMiddleware

from bikeshed.server.app import WsgiApplication


def create_app():
    from bikeshed.commands.base import get_store
    store = get_store()

    base_dir = os.path.dirname(__file__)
    static_path = os.path.join(base_dir, 'static')
    template_dir = os.path.join(base_dir, 'templates')
    redis = StrictRedis()

    app = WsgiApplication(store=store, template_dir=template_dir, redis=redis)

    return SharedDataMiddleware(app, {
        '/static': static_path,
    })


app = create_app()

