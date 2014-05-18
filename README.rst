Promise less or do more
=======================

Installation
------------

Install elasticsearch and redis, listening on default ports on localhost.

.. code::
    
    $ python setup.py develop
    $ python -m bikeshed.commands.create_index
    $ python -m bikeshed.commands.reindex
    $ gunicorn bikeshed.wsgi:app

Go to http://127.0.0.1:8000

Development
-----------

To build the static resources, install `traceur`_ and `sass`_. Then run:

.. code::

    $ ./make.sh

This can be run automatically whenever js or css files change:

.. code::

    $ pip install watchdog
    $ ./watch-static.sh

Finally, you can run werkzeug's development server that will restart when 
bikeshed modules change:

.. code::

    $ python -m bikeshed.commands.devserver


.. _traceur: https://github.com/google/traceur-compiler
.. _sass: http://sass-lang.com/
