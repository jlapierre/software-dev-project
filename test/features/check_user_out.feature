# Created by Jenny at 11/27/2017
Feature: Check user out

  Scenario: valid checkout
    Given the following users are in the database:
    | _id | auth_role   |
    | 123 | STUDENT     |
    And the following partners are in the database:
    | _id | name      |
    | 444 | partner 1 |
    And user 123 is logged in
    And user 123 has these entries in their civic log:
    | partner    | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    And the most recent entry under user 123 has a check-in time of 2 hours ago
    And the most recent entry under user 123 has no check-out time
    When user 123 checks out
    Then the most recent entry under user 123 should have a check-out time of roughly the current time

# TODO: return errors
#  Scenario: no current activity
#    Given the following users are in the database:
#    | _id | auth_role   |
#    | 123 | STUDENT     |
#    And the following partners are in the database:
#    | _id | name      |
#    | 444 | partner 1 |
#    And user 123 is logged in
#    And user 123 has these entries in their civic log:
#    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
#    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
#    And the most recent entry under user 123 has a check-in time of 2 hours ago
#    And the most recent entry under user 123 has a check-out time of 1 hours ago
#    When user 123 checks out
#    Then it should return an error with the code 400 and message "user has no active check-ins to complete"
#
#  Scenario: wrong user id
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
#    When user 123 checks out
#    Then it should return an error with the code 403 and message "access denied"
