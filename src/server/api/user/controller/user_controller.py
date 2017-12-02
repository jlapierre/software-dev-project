import json

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
