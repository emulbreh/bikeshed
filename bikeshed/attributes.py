import re
from datetime import datetime
import docutils.core
import dateutil.parser

from bikeshed.exceptions import AttributeFormatError, FileFormatError, ReferenceLookupError


class Value(object):
    def __init__(self, attribute, value):
        self.attribute = attribute
        self.value = value

    def __unicode__(self):
        return u"%s: %s" % (self.attribute.key, unicode(self.value))

    def html_value(self):
        return self.attribute.to_html(self.value)


class Attribute(object):
    def __init__(self, key, choices=None, default=None, aliases=(), readonly=False, hidden=False):
        self.key = key
        self.choices = choices
        self.default = default
        self.aliases = aliases
        self.readonly = readonly
        self.hidden = hidden

    def parse(self, store, value):
        if self.choices and value and value not in self.choices:
            choices = ', '.join(unicode(c) for c in self.choices)
            raise AttributeFormatError(u"value must be one of: %s; got %s" % (choices, value))
        return Value(self, value)

    def serialize(self, value):
        return value

    def __get__(self, doc, doctype):
        if doc is None:
            return self
        return doc[self.key]

    def __set__(self, doc, value):
        doc[self.key] = value

    def to_html(self, value):
        return value

    def mapping_type(self):
        return {'type': 'string'}


class Identifier(Attribute):
    def mapping_type(self):
        return {'type': 'string', 'index': 'not_analyzed'}


class DatetimeAttribute(Attribute):
    def parse(self, store, value):
        if value and not isinstance(value, datetime):
            try:
                value = dateutil.parser.parse(value)
            except ValueError:
                raise AttributeFormatError(u"invalid datetime value: %s" % value)
        return super(DatetimeAttribute, self).parse(store, value)

    def serialize(self, value):
        if value:
            return value.strftime('%Y-%m-%dT%H:%M')

    def mapping_type(self):
        return {'type': 'date'}


class TicketRef(Identifier):
    def parse(self, store, value):
        value = store.resolve_reference(value)
        return super(TicketRef, self).parse(store, value)

    def serialize(self, value):
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

    def to_html(self, value):
        if hasattr(value, 'get_label'):
            return '<a href="/view/%s/">%s</a>' % (value.uid, value.get_label())
        return super(TicketRef, self).to_html(value)



