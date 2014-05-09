from itsdangerous import TimestampSigner, BadSignature, SignatureExpired
import bcrypt


session_key_signer = TimestampSigner('bikeshedsession')


def clean_session_key(key):
    try:
        return session_key_signer.unsign(key, max_age=3600 * 12)
    except BadSignature, SignatureExpired:
        raise ValueError


def create_session_key(uid):
    return session_key_signer.sign(uid)


def hash_password(password, salt=None):
    if salt is None:
        salt = bcrypt.gensalt()
    return bcrypt.hashpw(password, salt)
