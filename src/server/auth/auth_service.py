from functools import wraps
from flask import request, Response
from server.config.private import SLACK_TOKEN


def check_auth(token):
    """
    Checks hardcoded slack token
    :param token: token from slack webhook body
    :return Boolean
    """
    return token == SLACK_TOKEN

def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_slack_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.form.get('token', '')
        if not auth or not check_auth(auth):
            return authenticate()
        return f(*args, **kwargs)
    return decorated
