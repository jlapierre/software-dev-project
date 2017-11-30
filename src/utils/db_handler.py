import pymongo
from server.config.private import MONGO_DB_URL
from server.config.private import MONGO_DB_NAME

print "Connecting to {0}...".format(MONGO_DB_URL)
client = pymongo.MongoClient(MONGO_DB_URL)
print "Linking to the following data: {0}...".format(MONGO_DB_NAME)
db = client[MONGO_DB_NAME]

COLLECTIONS = ['enumerations', 'users', 'partners']