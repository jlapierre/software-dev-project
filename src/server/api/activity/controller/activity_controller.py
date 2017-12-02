import datetime

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
    return database["users"].find_one({"_id":user_id})["activities"].insert(activity)


def check_user_out(database, user_id):
    """check out the current user's open activity by adding an end time"""
    return database["users"].find_one({"_id":user_id})["activities"].find_one_and_update(
        {"end_time":None}, # find an activity with no end time
        {"$set": {"end_time": datetime.datetime.now()}} # set the end time to the current time
    )


def get_user_activity(database, user_id):
    """return the current activity for the given user"""
    r = database["users"].find_one({"_id": user_id})["activities"]
    if r is None: r = []
    return r