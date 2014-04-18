HTTP API
========

``/api/documents/``


offset=0

    skip first ``offset`` documents


limit=50

    maximum number of documents to return

q=

    search query

type=

    comma separated list of document types


.. code:: json

    {
        "documents": [
            {
                "type": "Bug",
                "uid": "437c14090b534af6b6b91e11c48b2efc",
                "url": "/api/document/437c14090b534af6b6b91e11c48b2efc/",
                "body": "",
                "headers": [
                    {
                        "value": "Bug",
                        "key": "Type",
                        "well_known": true
                    },
                    {
                        "value": "3",
                        "key": "Number",
                        "well_known": true
                    },
                    {
                        "value": "test numbering 2",
                        "key": "Summary",
                        "well_known": true
                    },
                    {
                        "value": "e6f468f2f94f4ff2bba55a2399d2d27b",
                        "key": "Project",
                        "well_known": true
                    }
                ],
                "html_body": ""
            }
        ]
    }

``/api/document/<DOCUMENT_ID>``