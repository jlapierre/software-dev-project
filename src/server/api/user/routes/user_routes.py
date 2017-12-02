from flask_cors import CORS
from flask import Blueprint, request, session, json
from server.api.user.controller import user_controller
from ...sso.routes.sso_routes import googleauth
from utils.db_handler import db

user_api = Blueprint('user_api', __name__)
CORS = CORS(user_api, resources={r"*": {"origins": "http://127.0.0.1:5000"}})

@user_api.route('/api/current_user')
def get_current_user():
    token = session.get('access_token')
    if token is None: return None
    auth = json.loads(googleauth().data)
    return user_controller.get_user_with_email(db, auth["email"])

@user_api.route('/api/get_user_with_email/<email>')
def get_user_with_email(email):
    return user_controller.get_user_with_email(db, email)

@user_api.route('/api/all_users')
def get_users():
    return user_controller.get_users(db)

@user_api.route('/api/upsert_user', methods=['POST'])
#@requiresomepermission
def upsert_user(user):
    user = {
        "email": request.form["email"],
        "checked_in": False,
        "legal_first": request.form.get["legal_first"],
        "legal_last": request.form["legal_last"],
        "preferred_first": request.form["preferred_first"],
        "preferred_last": request.form["preferred_last"],
        "pronouns": request.form["pronouns"],
        "peer_leaders": [],
        "core_partner": None,
        "activities": {},
        "auth_role": "Student",
        "neu_start": request.form["neu_start"],
        "aces_start": request.form["aces_start"],
        "badge": None,
        "is_active": True
    }
    return user_controller.upsert_user(db, user)

@user_api.route('/api/delete_user/<user_id>')
#@requiresomepermission
def delete_user(user_id):
    return user_controller.delete_user(db, user_id)

