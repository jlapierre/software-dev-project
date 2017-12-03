from flask import Blueprint, json
from server.auth.auth_service import require_login
from ..controller.user_controller import get_user_with_email
from ...sso.routes.sso_routes import googleauth
from utils.db_handler import db

user_api = Blueprint('user_api', __name__)


@user_api.route('/api/current_user')
@require_login
def get_current_user():
    auth = json.loads(googleauth().data)
    return get_user_with_email(db, auth["email"])
