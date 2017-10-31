from flask import Flask
from api.example.routes.example_routes import example_api

app = Flask(__name__)

# Add example api routes
app.register_blueprint(example_api)
