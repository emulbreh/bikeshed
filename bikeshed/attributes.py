import re
from datetime import datetime
import docutils.core
import dateutil.parser

from bikeshed.exceptions import AttributeFormatError, FileFormatError, ReferenceLookupError, Readonly
from bikeshed.auth import hash_password


_attribute_creation_counter = 0


class Attribute(object):
    def __init__(self, key, choices=None, default=None, aliases=(), readonly=False, hidden=False):
        self.key = key
        self.choices = choices
        self.default = default
        self.aliases = aliases
        self.readonly = readonly
        self.hidden = hidden
        global _attribute_creation_counter
        _attribute_creation_counter += 1
        self.creation_counter = _attribute_creation_counter

    def set(self, doc, value, force=False):
        if self.choices and value and value not in self.choices:
            choices = ', '.join(unicode(c) for c in self.choices)
            raise AttributeFormatError(u"value must be one of: %s; got %s" % (choices, value))
        doc.header_values[self.key] = value

    def get(self, doc):
        return doc.header_values.get(self.key, self.default)

    def delete(self, doc):
        if self.key in doc.header_values:
            del doc.header_values[self.key]

    def serialize(self, doc):
        return self.get(doc)

    def __get__(self, doc, doctype):
        if doc is None:
            return self
        return self.get(doc)

    def __set__(self, doc, value):
        self.set(doc, value)

    def get_html(self, doc):
        return self.get(doc)

    def dump(self, doc):
        value = self.get(doc)
        if value is not None:
            return unicode(value)

    def mapping_type(self):
        return {'type': 'string'}


class Identifier(Attribute):
    def mapping_type(self):
        return {'type': 'string', 'index': 'not_analyzed'}


class Password(Attribute):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('hidden', True)
        super(Password, self).__init__(*args, **kwargs)

    def set(self, doc, value, **kwargs):
        if not value:
            raise Readonly()
        if value[0] != '$':
            value = hash_password(value.encode('utf-8'))
        return super(Password, self).set(doc, value, **kwargs)


class DatetimeAttribute(Attribute):
    def set(self, doc, value, **kwargs):
        if value and not isinstance(value, datetime):
            try:
                value = dateutil.parser.parse(value)
            except ValueError:
                raise AttributeFormatError(u"invalid datetime value: %s" % value)
        return super(DatetimeAttribute, self).set(doc, value, **kwargs)

    def serialize(self, doc):
        value = self.get(doc)
        if value:
            return value.strftime('%Y-%m-%dT%H:%M')

    def mapping_type(self):
        return {'type': 'date'}


class TicketRef(Identifier):
    def set(self, doc, value, **kwargs):
        value = doc.store.resolve_reference(value)
        return super(TicketRef, self).set(doc, value, **kwargs)

    def serialize(self, doc):
        value = self.get(doc)
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

    def get_html(self, doc):
        value = self.get(doc)
        if hasattr(value, 'get_label'):
            return '<a href="/view/%s/">%s</a>' % (value.uid, value.get_label())
        return super(TicketRef, self).get_html(value)



