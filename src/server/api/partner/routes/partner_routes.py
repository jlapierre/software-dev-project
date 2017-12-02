from flask_cors import CORS
from flask import Blueprint, request, session, json
from server.api.partner.controller import partner_controller
from utils.db_handler import db

partner_api = Blueprint('partner_api', __name__)
CORS = CORS(partner_api, resources={r"*": {"origins": "http://127.0.0.1:5000"}})

@partner_api.route('/api/all_partners')
def get_partners():
    return partner_controller.get_partners(db)

@partner_api.route('/api/create_partner', methods=["POST"])
def create_partner():
    partner = {
        "name": request.form["name"],
        "contacts": {},
        "locations": {},
        "core_partner": False,
        "is_active": True
    }
    return partner_controller.upsert_partner(db, partner)

@partner_api.route('/api/update_partner', methods=["POST"])
def update_partner():
    partner = {
        "name": request.form["name"]
        # "attr1": val1 ...
    }
    return partner_controller.upsert_partner(db, partner)

@partner_api.route('/api/delete_partner/<partner_id>', methods=["POST"])
def delete_partner(partner_id):
    return partner_controller.remove_partner(db, partner_id)

@partner_api.route('/api/add_location/', methods=["POST"])
def add_location():
    partner_id = request.form["partner_id"]
    location = {
        "address": {
            "street": request.form["street"],
            "city": request.form["city"],
            "state": request.form["state"],
            "zipcode": request.form["zipcode"]
        },
        "active": True
    }
    return partner_controller.add_location(db, partner_id, location)

@partner_api.route('/api/add_contact/', methods=["POST"])
def add_location():
    partner_id = request.form["partner_id"]
    contact = {
        "name": request.form["name"],
        "email": request.form["email"],
        "phone": request.form["phone"]
        "active": True
    }
    return partner_controller.add_contact(db, partner_id, contact)