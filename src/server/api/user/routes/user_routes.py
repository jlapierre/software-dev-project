from flask_cors import CORS
from flask import Blueprint, request, session, json
from bson.json_util import dumps
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
    return dumps(user_controller.get_user_with_email(db, auth["email"]))

@user_api.route('/api/get_user_with_email/<email>')
def get_user_with_email(email):
    return dumps(user_controller.get_user_with_email(db, email))

@user_api.route('/api/all_users')
def get_users():
    return dumps(user_controller.get_users(db))

@user_api.route('/api/create_student', methods=['POST'])
#@requiresomepermission
def create_student():
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
    return dumps(user_controller.upsert_user(db, user))

@user_api.route('/api/update_user', methods=['POST'])
#@requiresomepermission
def update_user():
    user = {
        "email": request.form["email"],
        # "attr1": val1 ...
    }
    return dumps(user_controller.upsert_user(db, user))

@user_api.route('/api/delete_user/<user_id>', methods=['POST'])
#@requiresomepermission
def delete_user(user_id):
    return dumps(user_controller.delete_user(db, user_id))

@user_api.route('/api/check_in', methods=['POST'])
def user_check_in():
    user_id = get_current_user()["_id"]
    partner_id = request.form["partner_id"]
    location = request.form["location"] # not currently used in controller
    contact = request.form["contact"] # not currently used in controller
    return dumps(user_controller.check_user_in(db, user_id, partner_id, location, contact))

@user_api.route('/api/check_out', methods=['POST'])
def user_check_out():
    user_id = get_current_user()["_id"]
    return dumps(user_controller.check_user_out(db, user_id))


@user_api.route('/api/user_activity', methods=['POST'])
def current_user_activity():
    user_id = get_current_user()["_id"]
    return dumps(user_controller.check_user_out(db, user_id))


@user_api.route('/api/user_activity/<_id>', methods=['POST'])
def user_activity_by_user_id(_id):
    return dumps(user_controller.check_user_out(db, _id))