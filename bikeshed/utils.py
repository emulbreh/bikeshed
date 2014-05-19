import functools


class CachedProperty(object):
    def __init__(self, getter):
        self.getter = getter
        self.name = '_%s_cache' % getter.__name__

    def __get__(self, obj, obj_type):
        if obj is None:
            return self
        if hasattr(obj, self.name):
            return getattr(obj, self.name)
        
        value = self.getter(obj)
        setattr(obj, self.name, value)
        return value

    def __set__(self, obj, value):
        setattr(obj, self.name, value)

    def __delete__(self, obj):
        if hasattr(obj, self.name):
            delattr(obj, self.name)


def cached_property(func):
    return functools.wraps(func)(CachedProperty(func))
