import re
from datetime import datetime
import docutils.core
import dateutil.parser

from bikeshed.exceptions import AttributeFormatError, FileFormatError, ReferenceLookupError, Readonly
from bikeshed.auth import hash_password


_attribute_creation_counter = 0


class Attribute(object):
    def __init__(self, key=None, choices=None, default=None, aliases=(), readonly=False, hidden=False, invisible=False):
        if invisible:
            hidden = True
        self.key = key
        self.choices = choices
        self.default = default
        self.aliases = aliases
        self.readonly = readonly
        self.hidden = hidden
        self.invisible = invisible
        global _attribute_creation_counter
        _attribute_creation_counter += 1
        self.creation_counter = _attribute_creation_counter

    def parse(self, doc, value):
        if self.choices and value and value not in self.choices:
            choices = ', '.join(unicode(c) for c in self.choices)
            raise AttributeFormatError(u"value must be one of: %s; got %s" % (choices, value))
        return value

    def set(self, doc, value, force=False):
        doc.header_values[self.key] = self.parse(doc, value)

    def get(self, doc):
        return doc.header_values.get(self.key, self.default)

    def delete(self, doc):
        if self.key in doc.header_values:
            del doc.header_values[self.key]

    def serialize(self, doc, value):
        return value

    def __get__(self, doc, doctype):
        if doc is None:
            return self
        return self.get(doc)

    def __set__(self, doc, value):
        self.set(doc, value)

    def get_html(self, doc, value):
        return unicode(value)

    def dump(self, doc, value):
        if value is not None:
            return unicode(value)

    def mapping_type(self):
        return {'type': 'string'}


class Identifier(Attribute):
    def mapping_type(self):
        return {'type': 'string', 'index': 'not_analyzed'}


class Password(Attribute):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('invisible', True)
        super(Password, self).__init__(*args, **kwargs)

    def parse(self, doc, value):
        if not value:
            raise Readonly()
        if value[0] != '$':
            value = hash_password(value.encode('utf-8'))
        return super(Password, self).parse(doc, value)


class DatetimeAttribute(Attribute):
    def parse(self, doc, value):
        if value and not isinstance(value, datetime):
            try:
                value = dateutil.parser.parse(value)
            except ValueError:
                raise AttributeFormatError(u"invalid datetime value: %s" % value)
        return super(DatetimeAttribute, self).parse(doc, value)

    def serialize(self, doc, value):
        if value:
            return value.strftime('%Y-%m-%dT%H:%M')

    def mapping_type(self):
        return {'type': 'date'}


class TicketRef(Identifier):
    def parse(self, doc, value):
        value = doc.store.resolve_reference(value)
        return super(TicketRef, self).parse(doc, value)

    def serialize(self, doc, value):
        if hasattr(value, 'uid'):
            return value.uid
        return value

    def render(self, store, value, raw=False):
        if not raw:
            try:
                target_doc = store.resolve_reference(value)
            except ReferenceLookupError:
                pass
            else:
                value = target_doc.get_label()
        return super(TicketRef, self).render(value, raw=raw)

    def get_html(self, doc, value):
        if hasattr(value, 'get_label'):
            return '<a href="/view/%s/">%s</a>' % (value.uid, value.get_label())
        return super(TicketRef, self).get_html(doc, value)


class List(Attribute):
    def __init__(self, key, attr, **kwargs):
        self.attr = attr
        kwargs['key'] = key
        kwargs.setdefault('default', ())
        super(List, self).__init__(**kwargs)

    def dump(self, doc, value):
        if value:
            return ', '.join(self.attr.dump(doc, item) for item in value)

    def serialize(self, doc, value):
        return [self.attr.serialize(doc, item) for item in value]

    def parse(self, doc, value):
        if isinstance(value, basestring):
            value = [item.strip() for item in value.split(',')]
        return [self.attr.parse(doc, item) for item in value if item]

    def mapping_type(self):
        return self.attr.mapping_type()

    def get_html(self, doc, value):
        return ', '.join(self.attr.get_html(doc, item) for item in value)



