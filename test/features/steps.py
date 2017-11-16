from lettuce import *
from test.data.MockDb import *


@before.each_scenario
def setup_some_scenario(scenario):
    world.db = MockDb()


@step('the following users are in the database')
def objects_are_in_database(step):
    world.db.addDataMulti("user", step.hashes)


@step('user (\d+) is logged in')
def user_is_logged_in(step, userId):
    """need to implement users and sessions"""


@step('I call get_users')
def get_users(step):
    """need to implement function"""
    world.result = []


@step('it should return an empty list')
def result_is_empty_list(step):
    assert world.result == []


@step('it should return the following users')
def result_is_given_users(step):
    """todo: implement user equal"""
    assert world.result == step.hashes


@step('the following peer leader relationships exist')
def set_peer_leaders(step):
    """todo: use actual user editing once implemented"""
    for user in step.hashes:
        if not world.db["users"][user['ID']].peer_leaders:
            world.db["users"][user['ID']].peer_leaders = []
        world.db["users"][user['ID']].peer_leaders.append(user.peer_leader)