Promise less or do more
=======================

Installation
------------

Install elasticsearch, listening on the default port on localhost.

.. code::
    
    $ python setup.py develop
    $ python -m pldm.commands.create_index
    $ python -m pldm.commands.reindex
    $ python -m pldm.commands.server

Go to http://127.0.0.1:7001