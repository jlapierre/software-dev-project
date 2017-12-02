import datetime
import uuid


def get_user_with_email(database, email):
    """return the user associated with the given email"""
    return database["users"].find_one({"email":email})


def get_users(database):
    """return all users the current user has access to"""
    return database["users"].find({})


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
    activity = {
        "activity_type": "Partner",
        "partner": database["partners"].find_one({"_id": partner_id}),
        "civic_category": "",
        "start_time": datetime.datetime.now(),
        "end_time": None,
        "manually_edited": False,
        "comment": ""
    }
    aid = "activities."+str(uuid.uuid1())
    return database["users"].find_one_and_update(
        {"_id":user_id},
        {"$set": {aid: activity}}
    )


def check_user_out(database, user_id):
    """check out the current user's open activity by adding an end time"""
    #lmfao this is awful
    #todo: do this in a sane way
    act = database["users"].find_one({"_id":user_id})["activities"]
    for k,v in act.iteritems():
        if v["end_time"] is None:
            v["end_time"] = datetime.datetime.now()
            break
    return database["users"].find_one_and_update(
        {"_id": user_id},
        {"$set": {"activities": act}}
    )


def get_user_activity(database, user_id):
    """return the current activity for the given user"""
    r = database["users"].find_one({"_id": user_id})["activities"]
    if r is None: r = []
    return r