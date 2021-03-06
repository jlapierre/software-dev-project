from lettuce import *
from server.api.partner.controller.partner_controller import *
from server.api.user.controller.user_controller import *
from utils.demo_mongo_seed import *
from utils.db_handler import *


def fields_match(expected, actual):
    match = True
    for k, v in expected.iteritems():
        print "comparing: " + k
        if actual and k in actual:
            print "expected: " + v + " | actual: " + actual[k]
            match = match and actual[k] == v
        else:
            match = False
    return match


def flatten_object(obj):
    """make object one-dimensional to check against test table
    e.g. the location object becomes location_street location_zip etc
    UNLESS in cases like partner._id, which becomes partner_id"""
    if not isinstance(obj, dict):
        return obj
    result = {}
    for k, v in obj.iteritems():
        if isinstance(v, dict):
            flat_obj = flatten_object(v)
            for nk, nv in flat_obj.iteritems():
                if nk == "_id":
                    flat_key = k + nk
                else:
                    flat_key = k + "_" + nk
                result[flat_key] = nv
        else:
            result[k] = v
    return result


def get_most_recent_entry(user):
    """return the newest entry in the civic log"""
    user = get_user(user)
    if user is None:
        return None
    activities = user["activities"]
    if activities is None or len(activities) == 0:
        return None
    sorted_activities = sorted(activities.itervalues(), key=lambda entry: entry["start_time"], reverse=True)
    return sorted_activities[0]


def make_location(checkin):
    result = {}
    if "location_street" in checkin:
        result["street"] = checkin["location_street"]
    if "location_city" in checkin:
        result["city"] = checkin["location_city"]
    if "location_state" in checkin:
        result["state"] = checkin["location_state"]
    if "location_zip" in checkin:
        result["zip"] = checkin["location_zip"]
    return result


def make_contact(checkin):
    result = {}
    if "contact_name" in checkin:
        result["name"] = checkin["contact_name"]
    if "contact_email" in checkin:
        result["email"] = checkin["contact_email"]
    if "contact_phone" in checkin:
        result["phone"] = checkin["contact_phone"]
    return result


def set_checkin_time(user, time):
    act = get_current_activity(db, user)
    activity = act.values()[0]
    activity["start_time"] = time
    upsert_civic_log_entry(user, activity, activity_id=act.keys()[0])


def set_checkout_time(user, time):
    act = get_current_activity(db, user)
    activity = act.values()[0]
    activity["end_time"] = time
    upsert_civic_log_entry(user, activity, activity_id=act.keys()[0])


@before.each_scenario
def clear_db(scenario):
    """clear the database"""
    drop_collections()


@step('the following users are in the database')
def step_put_users_in_database(step):
    add_users(step.hashes)


@step('user (\d+) is logged in')
def step_user_is_logged_in(step, user_id):
    """todo: actually log user in"""
    world.civic_log_before = {}


@step('I call get_users')
def step_get_users(step):
    world.result = get_users(db)


@step('I get the user with email (.+)')
def step_get_user_with_email(step, email):
    """need to implement function"""
    world.result = get_user_with_email(db, email)


@step('it should return an empty list')
def step_result_is_empty_list(step):
    assert world.result == []


@step("it should return the following users")
def step_result_is_given_users(step):
    assert len(world.result) == len(step.hashes)
    for user in step.hashes:
        assert any(map(lambda engagement: fields_match(user, engagement), world.result))


@step('the following peer leader relationships exist')
def step_set_peer_leaders(step):
    for entry in step.hashes:
        user_id = entry["_id"]
        user = get_user(user_id)
        peer_leaders = []
        if "peer_leaders" in user:
            peer_leaders.extend(user["peer_leaders"])
        update_user(user_id, {"peer_leaders": peer_leaders})


@step("there are no partners in the database")
def step_no_partners_in_db(step):
    db["partners"].remove({})


@step("I get all partners from the database")
def step_get_partners(step):
    world.result = get_partners(db)


@step("the following partners are in the database:")
def step_put_partners_in_db(step):
    add_partners(step.hashes)


@step("it should return the following partners")
def step_assert_partners_in_db(step):
    assert len(world.result) == len(step.hashes)
    for partner in step.hashes:
        assert any(map(lambda engagement: fields_match(partner, engagement), world.result))


@step("user (\d+) checks in with the following info:")
def step_check_in(step, user_id):
    checkin = step.hashes[0]
    location = make_location(checkin)
    contact = make_contact(checkin)
    check_user_in(db, user_id, checkin["partner"], location, contact)


@step("an entry should be created under user (\d+) with the following fields:")
def step_engagement_entry_created(step, user):
    activities = get_civic_log(user).itervalues()
    assert any(map(lambda engagement: fields_match(step.hashes[0], flatten_object(engagement)), activities))


@step("the most recent entry under user (\d+) should have a check-in time of roughly the current time")
def step_checkin_time(step, user):
    checkin_time = get_most_recent_entry(user)["start_time"]
    diff = datetime.datetime.now() - checkin_time
    assert diff.total_seconds() < 60


@step("the most recent entry under user (\d+) should have no check-out time")
def step_no_checkout_time(step, user):
    assert not get_most_recent_entry(user)["end_time"]


@step("no new entry should be created under user (\d+)")
def step_engagement_entry_not_created(step, user):
    civic_log_before = world.civic_log_before
    civic_log_now = get_civic_log(user)
    assert len(civic_log_before) == len(civic_log_now)


@step("user (\d+) has these entries in their civic log:")
def step_put_entries_in_log(step, user):
    for entry in step.hashes:
        contact = make_contact(entry)
        location = make_location(entry)
        check_user_in(db, user, entry["partner"], location, contact)
    if get_civic_log(user):
        world.civic_log_before = get_civic_log(user)
        print "civic log before"
        print world.civic_log_before


@step("the most recent entry under user (\d+) has a check-in time of roughly the current time")
def step_set_checkin_time_now(step, user):
    set_checkin_time(user, datetime.datetime.now())




@step("the most recent entry under user (\d+) has no check-out time")
def step_set_checkout_time_to_none(step, user):
    set_checkout_time(user, None)


@step("I get the current activity for user (\d+)")
def step_get_current_activity(step, user):
    activity = get_current_activity(db, user)
    if activity is None:
        world.result = None
    else:
        world.result = activity.values()[0]


@step("it should return the following activity:")
def step_assert_current_activity(step):
    actual = flatten_object(world.result)
    expected = step.hashes[0]
    assert fields_match(expected, actual)


@step("the most recent entry under user (\d+) has a check-in time of (\d+) hours ago")
def step_set_checkin_time_past(step, user, lapse_amt):
    set_checkin_time(user, datetime.datetime.now() - datetime.timedelta(hours=int(lapse_amt)))


@step("the most recent entry under user (\d+) has a check-out time of (\d+) hours ago")
def step_set_checkout_time_past(step, user, lapse_amt):
    set_checkout_time(user, datetime.datetime.now() - datetime.timedelta(hours=int(lapse_amt)))


@step("it should return None")
def step_assert_no_activity(step):
    assert world.result is None


@step('it should return an error with the code (\d+) and message "(.*)"')
def step_assert_error(step, error_code, error_message):
    assert world.result["error_code"] == error_code
    assert world.result["error_message"] == error_message


@step("user (\d+) checks out")
def step_check_user_out(step, user):
    check_user_out(db, user)


@step("the most recent entry under user (\d+) should have a check-out time of roughly the current time")
def step_assert_checkout_now(step, user):
    entry = get_most_recent_entry(user)
    if entry is None:
        assert False # fail
    checkout_time = entry["end_time"]
    diff = datetime.datetime.now() - checkout_time
    assert diff.total_seconds() < 60


@step("it should return the user below:")
def step_assert_user(step):
    assert fields_match(step.hashes[0], world.result)