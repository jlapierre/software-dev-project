"""__init__ to setup Flask app and to import API routes"""
import os
from flask import Flask
from api.front_end.routes.front_end_routes import frontend_api
from api.sso.routes.sso_routes import sso_api
from api.user.routes.user_routes import user_api
from config.private import APP_SECRET_KEY, APP_DEBUG

app = Flask(__name__)
app.debug = APP_DEBUG
app.secret_key = APP_SECRET_KEY
ROOT_PATH = os.path.abspath(os.path.join(app.root_path, '..'))

# Add front_end api routes
app.register_blueprint(sso_api)
app.register_blueprint(frontend_api)
app.register_blueprint(user_api)

# Add CORS
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['CORS_HEADERS'] = 'Content-Type'
