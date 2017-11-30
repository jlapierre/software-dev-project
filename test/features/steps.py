import copy
import datetime

from lettuce import *

from server.api.activity.controller.activity_controller import *
from server.api.partner.controller.partner_controller import *
from server.api.user.controller.user_controller import *
from test.data.MockDb import *


def fields_match(expected, actual):
    match = True
    for k, v in expected:
        match = match and actual[k] == v
    return match


def flatten_object(obj):
    """make object one-dimensional to check against test table
    e.g. the location object becomes location_street location_zip etc"""
    result = {}
    for k, v in obj:
        if isinstance(v, dict):
            flat_obj = flatten_object(v)
            for nk, nv in flat_obj:
                flat_key = k + "_" + nk
                result[flat_key] = nv
        else:
            result[k] = v
    return result


def get_most_recent_entry(user, db):
    """return the newest entry in the civic log"""
    if not db:
        db = world.db
    return sorted(db["users"][user]["civic_log"], key=lambda entry: entry.check_in, reverse=True)[0]


def copy_db():
    world.db_before = copy.deepcopy(world.db)


def make_location(checkin):
    return {
        "street": checkin["location_street"],
        "city": checkin["location_city"],
        "state": checkin["location_state"],
        "zip_code": checkin["location_zip"]
    }


def make_contact(checkin):
    return {
        "street": checkin["location_street"],
        "city": checkin["location_city"],
        "state": checkin["location_state"],
        "zip_code": checkin["location_zip"]
    }


def set_checkin_time(user, time):
    get_most_recent_entry(user, world.db)["check_in"] = time


def set_checkout_time(user, time):
    get_most_recent_entry(user, world.db)["check_out"] = time


@before.each_scenario
def step_setup_some_scenario(scenario):
    world.db = MockDb()


@step('the following users are in the database')
def step_put_users_in_database(step):
    world.db.add_data_multi("users", step.hashes)


@step('user (\d+) is logged in')
def step_user_is_logged_in(step, userId):
    """need to implement users and sessions"""


@step('I call get_users')
def step_get_users(step):
    world.result = get_users(world.db)


@step('I get the user with email (.+)')
def step_get_user_with_email(step, email):
    """need to implement function"""
    world.result = get_user_with_email(world.db, email)


@step('it should return an empty list')
def step_result_is_empty_list(step):
    assert world.result == []


@step('it should return the following users')
def step_result_is_given_users(step):
    assert len(world.result) == len(step.hashes)
    for user in step.hashes:
        assert any(map(lambda engagement: fields_match(user, engagement), world.result))


@step("it should return the following user")
def step_result_user(step):
    assert fields_match(step.hashes[0], world.result)


@step('the following peer leader relationships exist')
def step_set_peer_leaders(step):
    """todo: use actual user editing once implemented"""
    for user in step.hashes:
        if not world.db["users"][user["ID"]].peer_leaders:
            world.db["users"][user["ID"]].peer_leaders = []
        world.db["users"][user["ID"]].peer_leaders.append(user.peer_leader)


@step("there are no partners in the database")
def step_no_partners_in_db(step):
    world.db["partners"] = []


@step("I get all partners from the database")
def step_get_partners(step):
    world.result = get_partners(world.db)


@step("the following partners are in the database:")
def step_put_partners_in_db(step):
    world.db.add_data_multi("partners", step.hashes)


@step("it should return the following partners")
def step_assert_partners_in_db(step):
    """todo: implement partner equal, check for items in list regardless of order, only check provided fields
    (once we implement partner objects)"""
    assert world.result == step.hashes


@step("I check in with the following info:")
def step_check_in(step):
    copy_db()
    checkin = step.hashes[0]
    location = make_location(checkin)
    contact = make_contact(checkin)
    check_user_in(world.db, checkin["partner_id"], location, contact)


@step("an entry should be created under user (\d+) with the following fields:")
def step_engagement_entry_created(step, user):
    assert any(map(lambda engagement: fields_match(step.hashes[0], engagement),
                   world.db.get_data("users", user)["civic_log"]))


@step("the most recent entry under user (\d+) should have a check-in time of roughly the current time")
def step_checkin_time(step, user):
    checkin_time = get_most_recent_entry(user)["check_in"]
    diff = datetime.datetime.now() - checkin_time
    assert diff.total_seconds() < 60


@step("the most recent entry under user (\d+) should have no check-out time")
def step_no_checkout_time(step, user):
    assert not get_most_recent_entry(user)["check_out"]


@step("no new entry should be created under user (\d+)")
def step_engagement_entry_not_created(step, user):
    assert (not world.db["users"][user]["civic_log"]) or \
           get_most_recent_entry(user, world.db) == get_most_recent_entry(user, world.db_before)


@step("user (\d+) has these entries in their civic log:")
def step_put_entries_in_log(step, user):
    for entry in step.hashes:
        contact = make_contact(entry)
        location = make_location(entry)
        new_entry = {
            "contact": contact,
            "location": location
        }
        world.db.get_data("users", user)["civic log"].append(new_entry)


@step("the most recent entry under user (\d+) has a check-in time of roughly the current time")
def step_set_checkin_time_now(step, user):
    set_checkin_time(user, datetime.datetime.now())


@step("the most recent entry under user (\d+) has no check-out time")
def step_set_checkout_time_to_none(step, user):
    set_checkout_time(user, None)


@step("I get the current activity for user (\d+)")
def step_get_current_activity(step, user):
    world.result = get_user_activity(world.db, user)


@step("it should return the following activity:")
def step_assert_current_activity(step):
    actual = flatten_object(world.result)
    assert fields_match(step.hashes[0], actual)


@step("the most recent entry under user (\d+) has a check-in time of (\d+) hours ago")
def step_set_checkin_time_past(step, user, lapse_amt):
    set_checkin_time(user, datetime.datetime.now() - datetime.timedelta(hours=lapse_amt))


@step("the most recent entry under user (\d+) has a check-out time of (\d+) hours ago")
def step_set_checkout_time_past(step, user, lapse_amt):
    set_checkout_time(user, datetime.datetime.now() - datetime.timedelta(hours=lapse_amt))


@step("it should not return an activity")
def step_assert_no_activity(step):
    assert not world.result["partner_id"] and not world.result["location"] and not world.result["contact"]


@step('it should return an error with the code (\d+) and message "(.*)"')
def step_assert_error(step, error_code, error_message):
    assert world.result["error_code"] == error_code
    assert world.result["error_message"] == error_message


@step("user (\d+) checks out")
def step_check_user_out(step, user):
    check_user_out(world.db, user)


@step("the most recent entry under user (\d+) should have a check-out time of roughly the current time")
def step_assert_checkout_now(step, user):
    checkout_time = get_most_recent_entry(user)["check_out"]
    diff = datetime.datetime.now() - checkout_time
    assert diff.total_seconds() < 60