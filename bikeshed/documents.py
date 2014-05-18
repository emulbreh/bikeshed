from collections import OrderedDict
from StringIO import StringIO
from operator import attrgetter

import docutils

from bikeshed.attributes import Attribute
from bikeshed.exceptions import ReferenceLookupError, FileFormatError, Readonly
from bikeshed.markup import markup


def parse_document(f):
    lineno = 0
    headers = OrderedDict()
    for line in f:
        lineno += 1
        line = line.strip()
        if not line:
            break
        try:
            key, value = line.split(':', 1)
        except ValueError:
            raise FileFormatError(line)
        headers[key.rstrip()] = value.lstrip()

    body = ''.join(line for line in f)
    return headers, body


class DocumentType(type):
    def __new__(cls, name, bases, attrs):
        type_attr = Attribute('Type')
        key_map = {'type': type_attr}
        for base in bases:
            if isinstance(base, DocumentType):
                key_map.update(base.key_map)
        for attr_name, value in attrs.iteritems():
            if isinstance(value, Attribute):
                key_map[value.key.lower()] = value
        if 'type_name' not in attrs:
            attrs['type_name'] = name

        headers = key_map.values()
        headers.sort(key=attrgetter('creation_counter'))
        new_cls = super(DocumentType, cls).__new__(cls, name, bases, attrs)
        new_cls.headers = headers
        new_cls.key_map = key_map
        return new_cls


class Document(object):
    __metaclass__ = DocumentType

    root = False

    def __init__(self, store, values=None, body='', number=None, uid=None, ignore_reference_errors=False):
        self.store = store
        self.uid = uid
        self.header_values = OrderedDict()
        self.body = body
        self.extra_header_values = {}
        if values:
            self.update_headers(values, ignore_reference_errors=ignore_reference_errors)

    def get_number(self):
        return None

    def get_label(self):
        return '#%s' % self.get_number()

    def __unicode__(self):
        return self.get_label()

    def get_title(self):
        return self.uid

    def get_parent(self):
        return None

    def is_root(self):
        return not self.get_parent()

    def get_root(self):
        if self.is_root():
            return self
        parent = self
        while parent and not parent.is_root():
            parent = parent.get_parent()
        return parent

    def get_header_spec(self, key):
        if isinstance(key, Attribute):
            return key
        return self.key_map[key.lower()]

    def set_header(self, key, value, force=False):
        try:
            header = self.get_header_spec(key)
        except KeyError:
            self.extra_header_values[key] = value
        else:
            header.set(self, value, force=force)

    def __setitem__(self, key, value):
        self.set_header(key, value)

    def __getitem__(self, key):
        try:
            header = self.get_header_spec(key)
        except KeyError:
            return self.extra_header_values[key]
        return header.get(self)

    def __delitem__(self, key):
        try:
            header = self.get_header_spec(key)
        except KeyError:
            del self.extra_header_values[key]
        else:
            header.delete(self)

    def __iter__(self):
        return self.header_values.itervalues()

    def clear(self):
        self.extra_header_values.clear()
        for header in self.headers:
            if not header.readonly:
                header.delete(self)

    def update_headers(self, values, ignore_reference_errors=False):
        for key, value in values.iteritems():
            try:
                self.set_header(key, value, force=True)
            except ReferenceLookupError:
                if not ignore_reference_errors:
                    raise

    def load(self, f, **kwargs):
        headers, body = parse_document(f)
        self.update_headers(headers)
        self.body = body

    def loads(self, blob, **kwargs):
        self.load(StringIO(blob), **kwargs)

    def dump(self, f, include_readonly=False, include_hidden=False, include_invisible=False):
        for header in self.headers:
            if not include_readonly and header.readonly:
                continue
            if not include_hidden and header.hidden:
                continue
            if not include_invisible and header.invisible:
                continue
            value = header.dump(self, header.get(self))
            if value is None:
                continue
            f.write(u'{}: {}\n'.format(header.key, value))
        for key, value in self.extra_header_values.iteritems():
            if value is None:
                continue
            f.write(u'{}: {}\n'.format(key, value))
        f.write(u"\n")
        f.writelines(self.body)

    def dumps(self, **kwargs):
        f = StringIO()
        self.dump(f, **kwargs)
        return f.getvalue()

    def serialize(self):
        data = {
            'body': self.body,
        }
        if self.uid:
            data['_id'] = self.uid
        for header in self.headers:
            value = header.serialize(self, header.get(self))
            if value is not None:
                data[header.key] = value
        data.update(self.extra_header_values)
        return data

    @classmethod
    def deserialize(cls, store, data):
        values = dict(data)
        return cls(
            store,
            uid=values.pop('_id'),
            body=values.pop('body', ''),
            values=values,
        )

    def html_body(self):
        return markup(self.store, self.body)
