def get_partners(database):
    """return all partners the current partner has access to"""
    return database["partners"].find({})


#partner is a dictionary representing the new partner
def upsert_partner(database, partner):
    """add or update the given partner in the database"""
    return database["partners"].update_one({
        "name": partner["name"]}, # find partner with matching name
        {"$set": partner}, # update with given values
        True # upsert mode flag
    )


def remove_partner(database, partner_id):
    """deactivate partner with given id"""
    return database["partners"].update_one(
        {"_id": partner_id}, # find partner with matching id
        {"$set": {"is_active": False}}
    )


def add_location(database, partner_id, location):
    """add location to given partner"""
    return database["partners"].find_one({"_id": partner_id})["locations"].insert(location)


def add_contact(database, partner_id, contact):
    """add contact to given partner"""
    return database["partners"].find_one({"_id": partner_id})["contacts"].insert(contact)