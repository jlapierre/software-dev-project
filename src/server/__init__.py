"""__init__ to setup Flask app and to import API routes"""
import os
from flask import Flask
from api.example.routes.example_routes import example_api
from api.sso.routes.sso_routes import sso_api
from config.private import APP_SECRET_KEY, APP_DEBUG

app = Flask(__name__)
app.debug = APP_DEBUG
app.secret_key = APP_SECRET_KEY
ROOT_PATH = os.path.abspath(os.path.join(app.root_path, '..'))

# Add example api routes
app.register_blueprint(sso_api)
app.register_blueprint(example_api)

# Add CORS
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['CORS_HEADERS'] = 'Content-Type'
