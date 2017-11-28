"""Todo: make an abstract base class to be used by this and the actual DB when implemented"""
from operator import itemgetter
class MockDb:
    """Mock instance of database accessor for testing"""
    def __init__(self):
        self.data = {}

    """obj must have ID"""
    def add_data(self, collection, obj):
        if not self.data.get(collection, False):
            self.data[collection] = {}
        self.data[collection][obj['ID']] = obj

    def add_data_multi(self, collection, objs):
        for obj in objs:
            self.add_data(collection, obj)

    def get_data(self, collection, ID):
        return self.data[collection][ID]