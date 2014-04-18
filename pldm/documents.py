from collections import OrderedDict
from StringIO import StringIO

import docutils

from pldm.attributes import Attribute, Value
from pldm.exceptions import ReferenceLookupError, FileFormatError
from pldm.markup import markup


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
        attributes = [type_attr]
        key_map = {'type': type_attr}
        for base in bases:
            if isinstance(base, DocumentType):
                attributes.extend(base.attributes)
                key_map.update(base.key_map)
        for attr_name, value in attrs.iteritems():
            if isinstance(value, Attribute):
                attributes.append(value)
                key_map[value.key.lower()] = value

        new_cls = super(DocumentType, cls).__new__(cls, name, bases, attrs)
        new_cls.attributes = attributes
        new_cls.key_map = key_map
        return new_cls


class Document(object):
    __metaclass__ = DocumentType

    root = False

    def __init__(self, store, values=None, body='', number=None, uid=None, ignore_reference_errors=False):
        self.store = store
        self.uid = uid
        self.values = OrderedDict()
        self.body = body
        self.extra_attributes = {}
        for attribute in self.attributes:
            self[attribute.key] = attribute.default
        if values:
            for key, value in values.iteritems():
                try:
                    self[key] = value
                except ReferenceLookupError:
                    if not ignore_reference_errors:
                        raise

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

    def __setitem__(self, key, value):
        try:
            attribute = self.key_map[key.lower()]
        except KeyError:
            self.extra_attributes[key] = value
        else:
            self.values[attribute.key] = attribute.parse(self.store, value)

    def __getitem__(self, key):
        try:
            attribute = self.key_map[key.lower()]
        except KeyError:
            return self.extra_attributes[key]
        value = self.values.get(attribute.key, attribute.default)
        if isinstance(value, Value):
            return value.value
        return value

    def __delitem__(self, key):
        if key in self.values:
            del self.values[key]
        elif key in self.extra_attributes:
            del self.extra_attributes[key]

    def __iter__(self):
        return self.values.itervalues()

    def clear(self):
        self.extra_attributes.clear()
        for key in self.values.keys():
            if not self.key_map[key.lower()].readonly:
                del self.values[key]

    def load(self, f, **kwargs):
        self.clear()
        headers, body = parse_document(f)
        for key, value in headers.iteritems():
            self[key] = value
        self.body = body

    def loads(self, blob, **kwargs):
        self.clear()
        self.load(StringIO(blob), **kwargs)

    def dump(self, f, include_readonly=False, include_hidden=False):
        for value in self:
            if not include_readonly and value.attribute.readonly:
                continue
            if not include_hidden and value.attribute.hidden:
                continue
            if value.value is None:
                continue
            f.write(unicode(value))
            f.write("\n")
        for key, value in self.extra_attributes.iteritems():
            if value is None:
                continue
            f.write(u'{}: {}\n'.format(key, value))
        f.write("\n")
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
        for key in self.values:
            attribute = self.key_map[key.lower()]
            value = attribute.serialize(self[key])
            if value is not None:
                data[key] = value
        for key, value in self.extra_attributes.iteritems():
            data[key] = value
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
