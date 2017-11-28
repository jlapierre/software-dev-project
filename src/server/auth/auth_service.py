from flask import Blueprint, session, redirect, url_for
from flask.ext.cors import CORS
from flask_oauth import OAuth
from functools import wraps
from server.config.private import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

example_api = Blueprint('example_api', __name__)

CORS = CORS(example_api, resources={r"*": {"origins": "http://127.0.0.1:5000"}})

OAUTH = OAuth()
GOOGLE = OAUTH.remote_app(
    'google',
    base_url='https://www.google.com/accounts/',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    request_token_url=None,
    request_token_params={
        'scope': 'https://www.googleapis.com/auth/userinfo.email',
        'response_type': 'code'},
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_method='POST',
    access_token_params={
        'grant_type': 'authorization_code'},
    consumer_key=GOOGLE_CLIENT_ID,
    consumer_secret=GOOGLE_CLIENT_SECRET)


def require_access_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        access_token = session.get('access_token')
        if access_token is None:
            return redirect(url_for('sso_api.login'))
        return f(*args, **kwargs)
    return decorated
