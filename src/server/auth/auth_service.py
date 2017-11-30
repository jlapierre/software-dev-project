from flask import session, redirect, url_for, render_template
from flask_oauth import OAuth
from functools import wraps
from server.config.private import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

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
        access_token = get_access_token()
        if access_token is None:
            return redirect(url_for('sso_api.login'))
        return f(*args, **kwargs)
    return decorated


def require_login(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        access_token = get_access_token()
        if access_token is None:
            return render_template('login.view.html')
        return f(*args, **kwargs)
    return decorated


@GOOGLE.tokengetter
def get_access_token():
    print str(session)
    return session.get('access_token')
