from bikeshed.wsgi import app


if __name__ == '__main__':
    from werkzeug.serving import run_simple
    run_simple('127.0.0.1', 7001, app, use_debugger=True, use_reloader=True)