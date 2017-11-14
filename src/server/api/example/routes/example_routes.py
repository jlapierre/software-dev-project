from flask import Blueprint, jsonify, request, send_from_directory
from ..controller import example_controller as kc
from server.auth.auth_service import requires_slack_auth

example_api = Blueprint('example_api', __name__)


# Serves all content within the client folder as the root /
@example_api.route('/<path:path>')
def serve_frontend(path):
    from server import ROOT_PATH
    return send_from_directory(ROOT_PATH + '/client/', path)


# Delegates slack hook
@example_api.route('/api/slack_hook', methods=['POST'])
@requires_slack_auth
def slack_hook():
    cmds = request.form.get('text', '').split(' ')
    response_url = request.form.get('response_url', '')
    return jsonify(kc.error())
