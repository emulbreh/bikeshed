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
    

.. _traceur: https://github.com/google/traceur-compiler
.. _sass: http://sass-lang.com/
