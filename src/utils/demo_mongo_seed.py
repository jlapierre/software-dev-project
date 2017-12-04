"""Script to initialize the database with example objects"""
import datetime
import pymongo
from bson import DBRef
from bson import ObjectId
from server.config.private import MONGO_DB_URL
from server.config.private import MONGO_DB_NAME
print "Connecting to {0}...".format(MONGO_DB_URL)
client = pymongo.MongoClient(MONGO_DB_URL)
print "Linking to the following data: {0}...".format(MONGO_DB_NAME)
db = client[MONGO_DB_NAME]
COLLECTIONS = ['enumerations', 'users', 'partners']

"""
Notes:
- Left out pronouns and preferred names from user
    - Reasoning: Editing user profiles isn't a priority
"""


def drop_collections():
    """
    Drops existing collections
    :return: Nothing
    """
    print "Dropping current MongoDB collections..."
    cols = db.collection_names()
    for c in COLLECTIONS:
        if c in cols:
            print "Dropping {0}...".format(c)
            db.drop_collection(c)


def create_collections():
    """
    Creates new collections
    :return: Nothing
    """
    print "Creating empty collections..."
    for c in COLLECTIONS:
        print "Creating {0}...".format(c)
        db.create_collection(c)


def populate_enumerations():
    """
    Adds enumeration objects to the data
    :return: Nothing
    """
    print "Populating the enumerations collection..."
    AuthRoles = {'_id': 'AuthRoles', 'values': ['Administrator', 'Peer Leader', 'Student']}
    ActivityTypes = {'_id': 'ActivityTypes', 'values': ['Partner', 'Civic', 'Alliance', 'Civic/Alliance']}
    CivicCategories = {'_id': 'CivicCategories', 'values': ['Voting', 'Community Meeting', 'Rally', 'Other']}
    BadgeLevels = {'_id': 'BadgeLevels', 'values': []}
    enumerations = [AuthRoles, ActivityTypes, CivicCategories, BadgeLevels]
    for e in enumerations:
        print 'Inserting {0} into Enumerations...'.format(e['_id'])
        db.enumerations.insert_one(e)


def populate_users():
    """
    Adds user objects to the data
    :return: Nothing
    """
    print "Populating the users collection..."
    Jonathan = {
        "_id": ObjectId('5a0b43b63d852b0cc7b6161b'),
        "email": "northcott.j@husky.neu.edu",
        "checked_in": True,
        "first_name": "Jonathan",
        "last_name": "Northcott",
        "pronouns": "he",
        "peer_leaders": [],
        "core_partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab772")),
        "activities": {
            '1': {
                "activity_type": "Partner",
                "partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab772")),
                "civic_category": "",
                "start_time": datetime.datetime(2017, 11, 14, 14, 1, 30),
                "end_time": datetime.datetime(2017, 11, 14, 15, 10, 53),
                "manually_edited": False,
                "comment": "This is a completed activity"
            },
            '2': {
                "activity_type": "Partner",
                "partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab772")),
                "civic_category": "",
                "start_time": datetime.datetime(2017, 11, 15, 14, 1, 30),
                "end_time": None,
                "manually_edited": False,
                "comment": "I'm currently checked into this location"
            },
            '3': {
                "activity_type": "Civic",
                "partner": None,
                "civic_category": "Voting",
                "start_time": datetime.datetime(2017, 11, 15, 14, 1, 30),
                "end_time": None,
                "manually_edited": False,
                "comment": "This is a civic activity"
            }
        },
        "auth_role": "Peer Leader",
        "neu_start": 2014,
        "aces_start": 2017,
        "badge": None,
        "is_active": True
    }
    Katherine = {
        "_id": ObjectId('5a0b43b63d852b0cc7b6161f'),
        "email": "mcdonough.kat@husky.neu.edu",
        "checked_in": False,
        "first_name": "Katherine",
        "last_name": "McDonough",
        "pronouns": "she",
        "peer_leaders": [DBRef('users', ObjectId("5a0b43b63d852b0cc7b6161b"))],
        "core_partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab779")),
        "activities": {
            '1': {
                "activity_type": "Partner",
                "partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab779")),
                "civic_category": "",
                "start_time": datetime.datetime(2017, 10, 14, 14, 11, 30),
                "end_time": datetime.datetime(2017, 10, 14, 16, 11, 30),
                "contact": 1,
                "location": 1,
                "manually_edited": False,
                "comment": "This is a completed activity"
            },
            '2': {
                "activity_type": "Alliance",
                "partner": None,
                "civic_category": "Rally",
                "start_time": datetime.datetime(2017, 11, 14, 14, 9, 30),
                "end_time": None,
                "manually_edited": False,
                "comment": "Random civic activity"
            }
        },
        "auth_role": "Peer Leader",
        "neu_start": 2014,
        "aces_start": 2017,
        "badge": None,
        "is_active": True
    }
    Jenny = {
        "_id": ObjectId('5a0b46ef3d852b0cc7b6161c'),
        "email": "lapierre.je@husky.neu.edu",
        "checked_in": False,
        "first_name": "Jennifer",
        "last_name": "LaPierre",
        "pronouns": "she",
        "peer_leaders": [
            DBRef('users', ObjectId("5a0b43b63d852b0cc7b6161b"))
        ],
        "core_partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab779")),
        "activities": {
            '1': {
                "activity_type": "Partner",
                "partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab779")),
                "civic_category": "",
                "start_time": datetime.datetime(2017, 10, 14, 14, 11, 30),
                "end_time": datetime.datetime(2017, 10, 14, 15, 9, 22),
                "manually_edited": False,
                "comment": "This is a completed activity"
            },
            '2': {
                "activity_type": "Civic/Alliance",
                "partner": None,
                "civic_category": "Other",
                "start_time": datetime.datetime(2017, 10, 14, 15, 9, 22),
                "end_time": None,
                "manually_edited": False,
                "comment": "This is a civic activity marked as Other"
            }
        },
        "auth_role": "Student",
        "neu_start": 2013,
        "aces_start": 2017,
        "badge": None,
        "is_active": True
    }
    Lawrence = {
        "_id": ObjectId('5a0b46ef3d852b0cc7b6161e'),
        "email": "lim.l@husky.neu.edu",
        "checked_in": False,
        "first_name": "Lawrence",
        "last_name": "Lim",
        "pronouns": "he",
        "peer_leaders": None,
        "core_partner": None,
        "activities": None,
        "auth_role": "Administrator",
        "neu_start": 2014,
        "aces_start": 2017,
        "badge": None,
        "is_active": True
    }
    Weintraub = {
        "_id": ObjectId('5a0b43b63d852b0cc7b6162f'),
        "email": "weintraub.m@neu.edu",
        "checked_in": False,
        "first_name": "Michael",
        "last_name": "Weintraub",
        "preferred_first": "",
        "preferred_last": "",
        "pronouns": "",
        "peer_leaders": None,
        "core_partner": None,
        "activities": None,
        "auth_role": "Administrator",
        "neu_start": 2009,
        "aces_start": 2017,
        "badge": None,
        "is_active": False
    }
    users = [Weintraub, Katherine, Jonathan, Jenny, Lawrence]
    for u in users:
        print "Adding {0} {1} to the users collection...".format(u['first_name'], u['last_name'])
        db.users.insert_one(u)


def populate_partners():
    """
    Add partner locations to the data
    :return: Nothing
    """
    print "Populating the partners collection..."
    Boston826 = {
        "_id": ObjectId("5126bc054aed4daf9e2ab772"),
        "name": "826 Boston",
        "contacts": {
            '1': {
                "name": "Jane Doe",
                "email": "jane@826Boston.com",
                "phone": "603-123-4567",
                "is_active": True
            },
            '2': {
                "name": "John Smith",
                "email": "john@826Boston.com",
                "phone": "603-455-9999",
                "is_active": True
            }
        },
        "locations": {
            '1': {
                "address": {
                    "street": "360 Huntington Ave",
                    "city": "Boston",
                    "state": "Massachusetts",
                    "zipcode": "02115",
                },
                "is_active": False,
                "name": "360 Huntington Ave, Boston Massachusetts, 02115",
                "location": {"lat": 42.340496, "lng": -71.087897}
            },
            '2': {
                "address": {
                    "street": "3035 Washington St",
                    "city": "Roxbury",
                    "state": "Massachusetts",
                    "zipcode": "02119",
                },
                "is_active": True,
                "name": "3035 Washington St, Roxbury Massachusetts, 02119",
                "location": {"lat": 42.3166404, "lng": -71.09769749999998}
            }
        },
        "core_partner": True,
        "is_active": True
    }
    ABCD = {
        "_id": ObjectId("5126bc054aed4daf9e2ab779"),
        "name": "ABCD Boston",
        "contacts": {
            '1': {
                "name": "Tom Cruise",
                "email": "tommy@bostonabcd.com",
                "phone": "617-123-4567",
                "is_active": True
            }
        },
        "locations": {
            '1': {
                "address": {
                    "street": "714 Parker Street",
                    "city": "Roxbury",
                    "state": "Massachusetts",
                    "zipcode": "02120",
                },
                "name": "714 Parker Street, Roxbury Massachusetts, 02120",
                "location": {"lat": 42.331206, "lng": -71.09714059999999},
                "is_active": True
            }
        },
        "core_partner": True,
        "is_active": True
    }
    partners = [Boston826, ABCD]
    for p in partners:
        print "Adding {0} to the partners collection...".format(p['name'])
        db.partners.insert_one(p)


def seed():
    """
    Runs the seed process
    :return: Nothing
    """
    response = raw_input("Continue with seed process? This will delete everything in {0}/{1}!! (y/n)".format(MONGO_DB_URL, MONGO_DB_NAME))
    if response == 'y':
        drop_collections()
        create_collections()
        populate_enumerations()
        populate_partners()
        populate_users()
    print "Goodbye!!"
