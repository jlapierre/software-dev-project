from flask import Blueprint, jsonify, request, send_from_directory
from flask.ext.cors import CORS, cross_origin
from flask import session, redirect, url_for, render_template
from flask_oauth import OAuth
from ..controller import example_controller as kc
from server.auth.auth_service import requires_slack_auth
from server.config.private import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
import json

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


@example_api.after_request
def add_header(req):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req

# Serves all content within the client folder as the root /
@example_api.route('/<path:path>')
@GOOGLE.authorized_handler
def serve_frontend(resp, path):
    access_token = get_access_token()
    if access_token is None:
        return render_template('login.view.html')
    from server import ROOT_PATH
    return send_from_directory(ROOT_PATH + '/client/', path)

# Delegates slack hook
@example_api.route('/api/slack_hook', methods=['POST'])
@requires_slack_auth
def slack_hook():
    cmds = request.form.get('text', '').split(' ')
    response_url = request.form.get('response_url', '')
    if len(cmds) > 0 and cmds[0] == 'stop':
        return jsonify(kc.stop_torrent_stream())
    elif len(cmds) > 1 and cmds[0] == 'start':
        return jsonify(kc.start_torrent_stream_delayed_response(cmds[1], response_url))
    else:
        return jsonify(kc.error())

@example_api.route('/api/googleauth')
@cross_origin(origin='127.0.0.1', headers=['Content-Type', 'Authorization'])
def googleauth():
    access_token = session.get('access_token')
    if access_token is None:
        return redirect(url_for('example_api.login'))
    
    access_token = access_token[0]
    from urllib2 import Request, urlopen, URLError
 
    headers = {'Authorization': 'OAuth '+access_token}
    req = Request('https://www.googleapis.com/oauth2/v1/userinfo',
                  None, headers)
    try:
        res = urlopen(req)
    except URLError, e:
        if e.code == 401:
            # Unauthorized - bad token
            session.pop('access_token', None)
            return redirect(url_for('example_api.login'))
        return res.read()
 
    return res.read()

@example_api.route('/login')
@cross_origin(origin='127.0.0.1', headers=['Content-Type', 'Authorization'])
def login():
    callback=url_for('example_api.authorized', _external=True)
    return GOOGLE.authorize(callback=callback)
 
@example_api.route(GOOGLE_REDIRECT_URI)
@GOOGLE.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect('/index.html')

@GOOGLE.tokengetter
def get_access_token():
    return session.get('access_token')


@example_api.route('/api/google_logout')
def google_logout():
    session.pop('access_token', None)
    return redirect('/index.html')
