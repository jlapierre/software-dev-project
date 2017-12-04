import datetime
from bson import ObjectId
from bson import DBRef
from utils.db_handler import *



def get_user_with_email(database, email):
    """return the user associated with the given email"""
    return database["users"].find_one({"email":email})


def get_users(database):
    """return all users the current user has access to"""
    """note: currently just returns all users"""
    return list(database["users"].find({}))


#user is a dictionary representing the new user
def upsert_user(database, user):
    """add or update the given user in the database"""
    if 'activities' in user and user['activities'] is not None:
        for k,v in user['activities'].iteritems():
            if "partner" in v :
                v["partner"] = ObjectId(v["partner"]["$oid"])
            if "_id" in v :
                v["_id"] = ObjectId(v["_id"]["$oid"])
            if "start_time" in v and v["start_time"] is not None:
                v["start_time"] = datetime.datetime.fromtimestamp(v["start_time"]["$date"]/1000.0)
            if "end_time" in v and v["end_time"] is not None:
                v["end_time"] = datetime.datetime.fromtimestamp(v["end_time"]["$date"]/1000.0)
            user['activities'][k] = v

    if 'peer_leaders' in user and user['peer_leaders'] is not None:
        for i, p in enumerate(user['peer_leaders']):
            if "$id" in p and p['$id'] is not None and '$oid' in p['$id']:
                user['peer_leaders'][i] = DBRef('users', ObjectId(p['$id']['$oid']))

    if "_id" in user and user["_id"] is not None and "$oid" in user["_id"]:
        user["_id"] = ObjectId(user["_id"]["$oid"])

    if "core_partner" in user and user["core_partner"] is not None and "$id" in user["core_partner"] and user["core_partner"]["$id"] is not None and "$oid" in user["core_partner"]["$id"]:
        user["core_partner"] = DBRef('partners', ObjectId(user["core_partner"]["$id"]["$oid"]))

    database["users"].update_one(
        {"email": user["email"]}, # find user with matching email
        {"$set": user}, # update with given values
        True # upsert mode flag
    )
    return database["users"].find_one({"email": user["email"]})


def remove_user(database, user_id):
    """deactivate user with given id"""
    return database["users"].delete_one(
        {"_id": user_id} # find user with matching id
    )


def check_user_in(database, user_id, partner_id, location, contact):
    """create an entry without a checkout time for the given user"""
    partner = database["partners"].find_one({"_id": partner_id})
    if partner is None:
        return
    activity = {
        "activity_type": "Partner",
        "partner": partner_id,
        "civic_category": "",
        "start_time": datetime.datetime.now(),
        "end_time": None,
        "location": location,
        "contact": contact,
        "manually_edited": False,
        "comment": ""
    }
    return upsert_civic_log_entry(user_id, activity)


def check_user_out(database, user_id):
    """check out the current user's open activity by adding an end time"""
    activity = get_current_activity(database, user_id)
    if activity is None:
        return
    activity_key = activity.keys()[0]
    activity_value = activity.values()[0]
    activity_value["end_time"] = datetime.datetime.now()
    return upsert_civic_log_entry(user_id, activity_value, activity_key)


def get_current_activity(database, user_id):
    """return the current activity for the given user with its ID"""
    activities = get_civic_log(user_id)
    for k,v in activities.iteritems():
        if "end_time" in v and v["end_time"] is None and v["activity_type"] == 'Partner' :
            return {k: v}
    return None