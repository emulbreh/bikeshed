import unittest

from bikeshed.query_language import Parser, FullTextFilter, BooleanFilter


class QueryLanguageTestCase(unittest.TestCase):
    def test_single_word(self):
        p = Parser('foo')
        q = p.read_query()
        self.assertIsInstance(q, FullTextFilter)
        self.assertEqual(q.query, 'foo')

    def test_single_quoted_string(self):
        p = Parser('"foo bar"')
        q = p.read_query()
        self.assertIsInstance(q, FullTextFilter)
        self.assertEqual(q.query, 'foo bar')

    def test_single_quoted_string_with_escape_sequence(self):
        p = Parser('"foo \\"bar"')
        q = p.read_query()
        self.assertIsInstance(q, FullTextFilter)
        self.assertEqual(q.query, 'foo "bar')

    def test_and(self):
        p = Parser('foo AND bar')
        q = p.read_query()
        self.assertIsInstance(q, BooleanFilter)
        self.assertEqual(q.op, 'and')
        self.assertEqual([f.query for f in q.filters], ['foo', 'bar'])

    def test_or(self):
        p = Parser('foo OR bar')
        q = p.read_query()
        self.assertIsInstance(q, BooleanFilter)
        self.assertEqual(q.op, 'or')
        self.assertEqual([f.query for f in q.filters], ['foo', 'bar'])
