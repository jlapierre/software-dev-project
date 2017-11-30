import json

def get_user_with_email(database, email):
    """return the user associated with the given email"""
    return database["users"].find_one({"email":email})


def get_users(database):
    """return all users the current user has access to"""
    return []


def upsert_user(database, user):
    """add or update the given user in the database"""
