
class DocumentProcessor(object):
    def __init__(self, store):
        self.store = store
        self.lookups = {}
        self.uid_lookups = {}
        self.resolved_docs = {}

    def add_lookup(self, key, value, callback=None):
        self.lookups.setdefault((key, value), set()).add(callback)
    
    def add_uid_lookup(self, uid):
        self.uid_lookups.setdefault(uid, set()).add(callback)

    def resolve_lookups(self):
        for (key, value), callbacks in self.lookups.iteritems():
            results = self.store.es.search(body={
                'limit': 2,
                'filter': {
                    'term': {
                        key: value,
                    }
                }
            })
            print results
            data = results['hits']['hits'][0]
            doc = self.store.deserialize(data)
            self.resolved_docs[(key, value)] = doc
            for callback in callbacks:
                callback(doc)
        
        for uid, callbacks in self.uid_lookups.iteritems():
            data = self.store.es.get(id=uid)
            doc = self.store.deserialize(data)
            self.resolved_docs[uid] = doc
            for callback in callbacks:
                callback(doc)


class DocumentRenderer(DocumentProcessor):
    def __init__(self, store):
        super(DocumentRenderer, self).__init__(store)
    
    def render(self, doc):
        for value in doc:
            value.prepare_renderer(self)
        self.resolve_lookups()


class DocumentParser(DocumentProcessor):
    def __init__(self, store):
        super(DocumentRenderer, self).__init__(store)

    def render(self, doc):
        for value in doc:
            value.prepare_renderer(self)
    
