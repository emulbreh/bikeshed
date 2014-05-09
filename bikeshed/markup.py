import re
import functools
import logging

import docutils
from lxml import etree
from lxml.html import HTMLParser, fragments_fromstring

from bikeshed.exceptions import ReferenceLookupError


_ref_re = re.compile(r'(?<![\w])(?:@[a-z]+|#\d+)')

logger = logging.getLogger(__name__)


class ReferenceParser(etree.TreeBuilder):
    def __init__(self, store, *args, **kwargs):
        super(ReferenceParser, self).__init__(*args, **kwargs)
        self.store = store
        self._path = []
        self._text_buffer = []

    def _flush_text_buffer(self):
        text = ''.join(self._text_buffer)
        self._text_buffer = []
        self.handle_data(text)

    def start(self, tag, attrs):
        self._flush_text_buffer()
        self._path.append(tag)
        super(ReferenceParser, self).start(tag, attrs)

    def end(self, tag):
        self._flush_text_buffer()
        self._path.pop()
        super(ReferenceParser, self).end(tag)

    def close(self):
        self._flush_text_buffer()
        return super(ReferenceParser, self).close()

    def data(self, text):
        self._text_buffer.append(text)

    def handle_data(self, text):
        offset = 0
        super_data = super(ReferenceParser, self).data
        for match in _ref_re.finditer(text):
            ref = match.group(0)
            print ref
            try:
                target = self.store.resolve_reference(ref)
                tag, attrs = 'a', {'href': '/view/%s/' % target.uid}
            except ReferenceLookupError:
                tag, attrs = 'span', {'class': 'deadref'}
            super_data(text[offset:match.start()])
            self.start(tag, attrs)
            super_data(ref)
            self.end(tag)
            offset = match.end()
        super_data(text[offset:])


def markup(store, text, initial_header_level=2):
    parts = docutils.core.publish_parts(
        source=text,
        writer_name='html',
        settings_overrides={
            'initial_header_level': initial_header_level,
        }
    )
    html = parts['body']
    parser = HTMLParser(target=ReferenceParser(store))
    try:
        tree = etree.fromstring(u'<html><body>%s</body></html>' % parts['body'], parser)
    except:
        logger.exception('failed to transform markup')
        return ''
    return '\n'.join(etree.tostring(fragment) for fragment in tree[0])


