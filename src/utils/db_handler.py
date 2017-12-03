import pymongo
from server.config.private import MONGO_DB_URL
from server.config.private import MONGO_DB_NAME
from bson import ObjectId

print "Connecting to {0}...".format(MONGO_DB_URL)
client = pymongo.MongoClient(MONGO_DB_URL)
print "Linking to the following data: {0}...".format(MONGO_DB_NAME)
db = client[MONGO_DB_NAME]

COLLECTIONS = ['enumerations', 'users', 'partners']


def get_all_users():
    """return all users in database"""
    return db["users"].find({})


def get_user(user_id):
    """get user by id"""
    return db["users"].find_one({"_id": user_id})


def add_users(users):
    """add users to database"""
    db["users"].insert(users)


def update_user(user_id, new_fields):
    db["users"].find_one_and_update({"_id": user_id}, {"$set": new_fields})


def add_partners(partners):
    """add partners to database"""
    db["partners"].insert(partners)


def get_civic_log(user_id):
    """return the given user's civic log"""
    user = get_user(user_id)
    if "activities" in user:
        return user["activities"]
    else:
        return []


def add_civic_log_entry(user_id, entry):
    """add entry to the given user's civic log"""
    new_log = get_civic_log(user_id).append(entry)
    db["users"].find_one_and_update({"_id": user_id}, {"$set": {"activities": new_log}})


def update_civic_log_entry(user_id, activity_id, new_entry):
    """add entry to the given user's civic log"""
    new_log = get_civic_log(user_id) # todo: update entry in log
    db["users"].find_one_and_update({"_id": user_id}, {"$set": {"activities": new_log}})
