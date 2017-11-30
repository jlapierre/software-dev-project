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
        "legal_first": "Jonathan",
        "legal_last": "Northcott",
        "preferred_first": "",
        "preferred_last": "",
        "pronouns": "",
        "peer_leaders": [],
        "core_partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab772")),
        "activities": {
            '2c008961b164448e9da546271e064f6e': {
                "activity_type": "Partner",
                "partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab772")),
                "civic_category": "",
                "start_time": datetime.datetime(2017, 11, 14, 14, 1, 30),
                "end_time": datetime.datetime(2017, 11, 14, 15, 10, 53),
                "manually_edited": False,
                "comment": "This is a completed activity"
            },
            '55cb59953369439e98a77579a4948256': {
                "activity_type": "Partner",
                "partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab772")),
                "civic_category": "",
                "start_time": datetime.datetime(2017, 11, 15, 14, 1, 30),
                "end_time": None,
                "manually_edited": False,
                "comment": "I'm currently checked into this location"
            },
            '85af60b5deb844fcae0dfdd25cab0edd': {
                "activity_type": "Civic",
                "partner": None,
                "civic_category": "Voting",
                "start_time": None,
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
        "email": "mcdonough.k@husky.neu.edu",
        "checked_in": False,
        "legal_first": "Katherine",
        "legal_last": "McDonough",
        "preferred_first": "",
        "preferred_last": "",
        "pronouns": "",
        "peer_leaders": [],
        "core_partner": None,
        "activities": None,
        "auth_role": "Administrator",
        "neu_start": 2014,
        "aces_start": 2017,
        "badge": None,
        "is_active": True
    }
    Jenny = {
        "_id": ObjectId('5a0b46ef3d852b0cc7b6161c'),
        "email": "lapierre.je@husky.neu.edu",
        "checked_in": False,
        "legal_first": "Jennifer",
        "legal_last": "LaPierre",
        "preferred_first": "",
        "preferred_last": "",
        "pronouns": "",
        "peer_leaders": [
            DBRef('users', ObjectId("5a0b43b63d852b0cc7b6161b"))
        ],
        "core_partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab779")),
        "activities": {
            '5dbcf814663c49939501dda6f3596fd2': {
                "activity_type": "Partner",
                "partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab779")),
                "civic_category": "",
                "start_time": datetime.datetime(2017, 10, 14, 14, 11, 30),
                "end_time": datetime.datetime(2017, 10, 14, 15, 9, 22),
                "manually_edited": False,
                "comment": "This is a completed activity"
            },
            '89c444b0a2ab49dab626cf0922834339': {
                "activity_type": "Civic/Alliance",
                "partner": None,
                "civic_category": "Other",
                "start_time": None,
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
        "legal_first": "Lawrence",
        "legal_last": "Lim",
        "preferred_first": "",
        "preferred_last": "",
        "pronouns": "",
        "peer_leaders": [
            DBRef('users', ObjectId("5a0b43b63d852b0cc7b6161b"))
        ],
        "core_partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab779")),
        "activities": {
            '93df9adfdfd04a81be0f5b114b9cfc99': {
                "activity_type": "Partner",
                "partner": DBRef('partners', ObjectId("5126bc054aed4daf9e2ab779")),
                "civic_category": "",
                "start_time": datetime.datetime(2017, 10, 14, 14, 11, 30),
                "end_time": datetime.datetime(2017, 10, 14, 15, 9, 22),
                "manually_edited": False,
                "comment": "This is a completed activity"
            },
            '54879a04b1464ca08320ed43df838c53': {
                "activity_type": "Alliance",
                "partner": None,
                "civic_category": "Rally",
                "start_time": None,
                "end_time": None,
                "manually_edited": False,
                "comment": "Random civic activity"
            }
        },
        "auth_role": "Student",
        "neu_start": 2014,
        "aces_start": 2017,
        "badge": None,
        "is_active": True
    }
    Weintraub = {
        "_id": ObjectId('5a0b43b63d852b0cc7b6162f'),
        "email": "weintraub.m@neu.edu",
        "checked_in": False,
        "legal_first": "Michael",
        "legal_last": "Weintraub",
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
        print "Adding {0} {1} to the users collection...".format(u['legal_first'], u['legal_last'])
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
            'd8e12321f41244ab9ecee6f42dc30071': {
                "name": "Jane Doe",
                "email": "jane@826Boston.com",
                "phone": "603-123-4567"
            },
            '2290aa403e934ce6b14e40a2022e98fd': {
                "name": "John Smith",
                "email": "john@826Boston.com",
                "phone": "603-455-9999"
            }
        },
        "locations": {
            'b4aeafd29b0b460b98172e0ea0b00979': {
                "address": {
                    "street": "360 Huntington Ave",
                    "city": "Boston",
                    "state": "Massachusetts",
                    "zipcode": "02115"
                },
                "active": False
            },
            '6d03a6a938074474bbcebb7d17556c39': {
                "address": {
                    "street": "3035 Washington St",
                    "city": "Roxbury",
                    "state": "Massachusetts",
                    "zipcode": "02119"
                },
                "active": True
            }
        },
        "core_partner": True
    }
    ABCD = {
        "_id": ObjectId("5126bc054aed4daf9e2ab779"),
        "name": "ABCD Boston",
        "contacts": {
            '51b352d81a7d420b827f20bd3dcecb47': {
                "name": "Tom Cruise",
                "email": "tommy@bostonabcd.com",
                "phone": "617-123-4567"
            }
        },
        "locations": {
            '8a58d9a6901445dabcc5dbf2d41c0bc6': {
                "address": {
                    "street": "714 Parker St",
                    "city": "Roxbury",
                    "state": "Massachusetts",
                    "zipcode": "02120"
                },
                "active": True
            }
        },
        "core_partner": True
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
