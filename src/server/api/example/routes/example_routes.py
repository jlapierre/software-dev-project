from server.auth.auth_service import GOOGLE
from flask import Blueprint, send_from_directory, render_template

example_api = Blueprint('example_api', __name__)


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
