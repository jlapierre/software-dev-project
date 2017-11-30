from server.auth.auth_service import GOOGLE, require_access_token, get_access_token
from flask_cors import cross_origin, CORS
from flask import Blueprint, session, redirect, url_for
from server.config.private import GOOGLE_REDIRECT_URI

sso_api = Blueprint('sso_api', __name__)
CORS = CORS(sso_api, resources={r"*": {"origins": "http://127.0.0.1:5000"}})


@sso_api.route('/login')
@cross_origin(origin='127.0.0.1', headers=['Content-Type', 'Authorization'])
def login():
    callback = url_for('sso_api.authorized', _external=True)
    return GOOGLE.authorize(callback=callback)


@sso_api.route(GOOGLE_REDIRECT_URI)
@GOOGLE.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect('/index.html')


@sso_api.route('/api/google_logout')
def google_logout():
    session.pop('access_token', None)
    return redirect('/index.html')


@sso_api.route('/api/googleauth')
@cross_origin(origin='127.0.0.1', headers=['Content-Type', 'Authorization'])
@require_access_token
def googleauth():
    access_token = get_access_token()
    from urllib2 import Request, urlopen, URLError
    headers = {'Authorization': 'OAuth ' + access_token}
    req = Request('https://www.googleapis.com/oauth2/v1/userinfo',
                  None, headers)
    try:
        res = urlopen(req)
    except URLError, e:
        if e.code == 401:
            # Unauthorized - bad token
            session.pop('access_token', None)
            return redirect(url_for('sso_api.login'))
        return res.read()

    return res.read()
