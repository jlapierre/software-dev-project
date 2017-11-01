from flask import Blueprint, jsonify, request, render_template, send_from_directory
from ..controller import example_controller as kc
from server.auth.auth_service import requires_slack_auth

example_api = Blueprint('example_api', __name__)


# Serves all content within the client folder as the root /
@example_api.route('/<path:path>')
def serve_frontend(path):
    return send_from_directory('../client/', path)

# Test route that has pre-filled parameters
#@example_api.route('/api/example/test', methods=['GET'])
def example_test():
    return jsonify(kc.example_test())

# Starts a torrent stream to Youtube from magnet link
#@example_api.route('/api/start', methods=['POST'])
def start_torrent_stream():
    return jsonify(kc.start_torrent_stream())

# Kills any torrent stream that is running
#@example_api.route('/api/stop', methods=['DELETE'])
def stop_torrent_stream():
    return jsonify(kc.stop_torrent_stream())

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
