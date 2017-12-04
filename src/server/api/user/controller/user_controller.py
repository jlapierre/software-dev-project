import datetime
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
    return database["users"].update_one(
        {"email": user["email"]}, # find user with matching email
        {"$set": user}, # update with given values
        True # upsert mode flag
    )


def remove_user(database, user_id):
    """deactivate user with given id"""
    return database["users"].update_one(
        {"_id": user_id}, # find user with matching id
        {"$set": {"is_active": False}}
    )


def check_user_in(database, user_id, partner_id, location, contact):
    """create an entry without a checkout time for the given user"""
    partner = database["partners"].find_one({"_id": partner_id})
    if partner is None:
        return
    activity = {
        "activity_type": "Partner",
        "partner": partner,
        "civic_category": "",
        "start_time": datetime.datetime.now(),
        "end_time": None,
        "manually_edited": False,
        "comment": "",
        "location": location,
        "contact": contact
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
        if "end_time" in v and v["end_time"] is None:
            return {k: v}
    return None
