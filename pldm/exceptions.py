
class DocumentDoesNotExist(Exception):
    pass


class FileFormatError(Exception):
    pass


class AttributeFormatError(FileFormatError):
    pass


class ReferenceLookupError(ValueError):
    pass