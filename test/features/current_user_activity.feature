# Created by Jenny at 11/25/2017
Feature: current user activity
# Todo: implement user permissions check to feature

  Scenario: student, own id, has current activity
    Given the following users are in the database:
    | _id | auth_role   |
    | 123 | STUDENT     |
    And the following partners are in the database:
    | _id | name      |
    | 444 | partner 1 |
    And user 123 is logged in
    And user 123 has these entries in their civic log:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    And the most recent entry under user 123 has a check-in time of roughly the current time
    And the most recent entry under user 123 has no check-out time
    When I get the current activity for user 123
    Then it should return the following activity:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |

  Scenario: student, own id, no current activity
    Given the following users are in the database:
    | _id | auth_role   |
    | 123 | STUDENT     |
    And the following partners are in the database:
    | _id | name      |
    | 444 | partner 1 |
    And user 123 is logged in
    And user 123 has these entries in their civic log:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    And the most recent entry under user 123 has a check-in time of 2 hours ago
    And the most recent entry under user 123 has a check-out time of 1 hours ago
    When I get the current activity for user 123
    Then it should return None

#  Scenario: student, other student's id
#    Given the following users are in the database:
#    | _id | auth_role   |
#    | 123 | STUDENT     |
#    | 456 | STUDENT     |
#    And the following partners are in the database:
#    | _id | name      |
#    | 444 | partner 1 |
#    And user 456 is logged in
#    And user 123 has these entries in their civic log:
#    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
#    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
#    And the most recent entry under user 123 has a check-in time of 2 hours ago
#    And the most recent entry under user 123 has no check-out time
#    When I get the current activity for user 123
#    Then it should not return an activity
#    And it should return an error with the code 403 and message "access denied"

  Scenario: peer leader, own student's id
    Given the following users are in the database:
    | _id | auth_role   |
    | 123 | STUDENT     |
    | 888 | PEER LEADER |
    And the following partners are in the database:
    | _id | name      |
    | 444 | partner 1 |
    And the following peer leader relationships exist:
    | _id | peer_leader |
    | 123 | 888         |
    And user 123 is logged in
    And user 123 has these entries in their civic log:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    And the most recent entry under user 123 has a check-in time of roughly the current time
    And the most recent entry under user 123 has no check-out time
    When I get the current activity for user 123
    Then it should return the following activity:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |

#  Scenario: peer leader, other student's id
#    Given the following users are in the database:
#    | _id | auth_role   |
#    | 123 | STUDENT     |
#    | 888 | PEER LEADER |
#    And the following partners are in the database:
#    | _id | name      |
#    | 444 | partner 1 |
#    And user 123 is logged in
#    And user 123 has these entries in their civic log:
#    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
#    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
#    And the most recent entry under user 123 has a check-in time of roughly the current time
#    And the most recent entry under user 123 has no check-out time
#    When I get the current activity for user 123
#    Then it should not return an activity
#    And it should return an error with the code 403 and message "access denied"

  Scenario: admin
    Given the following users are in the database:
    | _id | auth_role   |
    | 123 | STUDENT     |
    | 999 | ADMIN       |
    And the following partners are in the database:
    | _id | name      |
    | 444 | partner 1 |
    And user 999 is logged in
    And user 123 has these entries in their civic log:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    And the most recent entry under user 123 has a check-in time of roughly the current time
    And the most recent entry under user 123 has no check-out time
    When I get the current activity for user 123
    Then it should return the following activity:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |