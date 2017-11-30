from flask_cors import CORS
from flask import Blueprint, request, session, json
from ..controller.user_controller import get_user_with_email
from ...sso.routes.sso_routes import googleauth
from utils.db_handler import db

user_api = Blueprint('user_api', __name__)
CORS = CORS(user_api, resources={r"*": {"origins": "http://127.0.0.1:5000"}})

@user_api.route('/api/current_user')
def get_current_user():
    token = session.get('access_token')
    if token is None: return None
    auth = json.loads(googleauth().data)
    return get_user_with_email(db, auth["email"])