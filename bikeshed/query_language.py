import functools
import re


token_patterns = (
    ('number', r'\d+(?:\.\d+)?'),
    ('op', r'[=:~]|[><]=?|!=|in'),
    ('bool_op', r'or|OR|and|AND'),
    ('begin_group', r'\('),
    ('end_group', r'\)'),
    ('word', r'\w+'),
    ('string', r'"(?:[^"\\]|\\["\\])*"|\'(?:[^\'\\]|\\[\'\\])*\''),
    ('begin_list', r'\['),
    ('end_list', r'\]'),
    ('whitespace', r'\s+'),
    ('junk', r'.'),
)

token_re = re.compile('|'.join('(?P<%s>%s)' % p for p in token_patterns))


class FullTextFilter(object):
    def __init__(self, query):
        self.query = query

    def __repr__(self):
        return '<FullTextFilter: %s>' % self.query


class Filter(object):
    def __init__(self, field, op, value):
        self.field = field
        self.op = op
        self.value = value

    def __repr__(self):
        return '<Filter: %s %s %s>' % (self.field, self.op, self.value)


class BooleanFilter(object):
    def __init__(self, op, filters):
        self.filters = filters
        self.op = op

    def __repr__(self):
        return '<BooleanFilter: %s>' % (' %s ' % self.op).join(repr(f) for f in self.filters)


class QuerySyntaxError(Exception):
    def __init__(self, msg, offset):
        msg = '%s at offset %s' % (msg, offset)
        super(QuerySyntaxError, self).__init__(msg)
        self.offset = offset


class EndOfQuery(QuerySyntaxError):
    pass


def unquote(s):
    quote = s[0]
    return s[1:-1].replace('\\%s' % quote, quote).replace('\\\\', '\\')


def parser(func):
    @functools.wraps(func)
    def wrapped(self, *args, **kwargs):
        index = self.index
        try:
            return func(self, *args, **kwargs)
        except QuerySyntaxError:
            self.index = index
            raise
    return wrapped


class Parser(object):
    def __init__(self, query):
        self.query = query
        self.tokens = list(self._tokenize())
        self.index = 0

    def _tokenize(self):
        print token_re.pattern
        for match in token_re.finditer(self.query):
            token_type = match.lastgroup
            offset = match.start(token_type)
            lexeme = match.group(token_type)
            print token_type, lexeme
            if token_type == 'junk':
                raise QuerySyntaxError('junk: %r' % lexeme, offset)
            if token_type == 'whitespace':
                continue
            yield token_type, lexeme, offset

    def next(self):
        if self.index == len(self.tokens):
            raise EndOfQuery('end of query', -1)
        token = self.tokens[self.index]
        self.index += 1
        return token

    def pushback(self):
        assert self.index > 0
        self.index -= 1

    @parser
    def read_value(self):
        token_type, lexeme, offset = self.next()
        if token_type == 'string':
            return unquote(lexeme)
        elif token_type == 'number':
            if '.' in lexeme:
                return float(lexeme)
            else:
                return int(lexeme)
        elif token_type == 'word':
            return lexeme
        raise QuerySyntaxError('expected value', offset)

    @parser
    def expect(self, tt):
        token_type, lexeme, offset = self.next()
        if token_type != tt:
            raise QuerySyntaxError('expected %s' % tt, offset)
        return lexeme

    @parser
    def read_condition(self):
        token_type, lexeme, offset = self.next()
        if token_type == 'word':
            try:
                op = self.expect('op')
            except QuerySyntaxError:
                return FullTextFilter(lexeme)
            value = self.read_value()
            return Filter(lexeme, op, value)
        if token_type == 'string':
            return FullTextFilter(unquote(lexeme))
        if token_type == 'begin_group':
            f = self.read_query()
            self.expect('end_group')
            return f
        raise QuerySyntaxError('expected condition', offset)

    @parser
    def read_and_query(self):
        filters = []
        try:
            while True:
                f = self.read_condition()
                filters.append(f)
                op = self.expect('bool_op').upper()
                if op != 'AND':
                    self.pushback()
                    break
        except QuerySyntaxError as e:
            pass
        if not filters:
            raise QuerySyntaxError('expected condition', offset)
        if len(filters) == 1:
            return filters[0]
        return BooleanFilter('and', filters)

    @parser
    def read_query(self):
        #print self.tokens
        filters = [self.read_and_query()]
        while True:
            try:
                op = self.expect('bool_op').upper()
            except QuerySyntaxError:
                break
            if op != 'OR':
                assert False, 'expected "or"'
            filters.append(self.read_and_query())
        if not filters:
            raise QuerySyntaxError('expected condition', offset)
        if len(filters) == 1:
            return filters[0]
        return BooleanFilter('or', filters)


