# Created by Jenny at 11/24/2017
# Feature: Check user in

  Scenario: valid check-in with location and contact
    Given the following partners are in the database:
    | ID  | name      | core_community_partner |
    | 444 | Partner 1 | True                   |
    And the following users are in the database:
    | ID  | auth_role   |
    | 123 | STUDENT     |
    And user 123 is logged in
    When I check in with the following info:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    Then an entry should be created under user 123 with the following fields:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    And the most recent entry under user 123 should have a check-in time of roughly the current time
    And the most recent entry under user 123 should have no check-out time

  Scenario: valid check-in without location and contact
    Given the following partners are in the database:
    | ID  | name      | core_community_partner |
    | 444 | Partner 1 | True                   |
    And the following users are in the database:
    | ID  | auth_role   |
    | 123 | STUDENT     |
    And user 123 is logged in
    When I check in with the following info:
    | partner_id |
    | 444        |
    Then an entry should be created under user 123 with the following fields:
    | partner_id |
    | 444        |
    And the most recent entry under user 123 should have a check-in time of roughly the current time
    And the most recent entry under user 123 should have no check-out time

  Scenario: invalid partner id
    Given the following partners are in the database:
    | ID  | name      | core_community_partner |
    | 444 | Partner 1 | True                   |
    And the following users are in the database:
    | ID  | auth_role   |
    | 123 | STUDENT     |
    And user 123 is logged in
    When I check in with the following info:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 404        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    Then no new entry should be created under user 123

  Scenario: open entry already exists
    Given the following partners are in the database:
    | ID  | name      | core_community_partner |
    | 444 | Partner 1 | True                   |
    And the following users are in the database:
    | ID  | auth_role   |
    | 123 | STUDENT     |
    And user 123 is logged in
    When I check in with the following info:
    | partner_id | location_street | location_city | location_state | location_zip | contact_name | contact_email | contact_phone |
    | 444        | 360 Madeup St   | Boston        | MA             | 02115        |              |               | 617-555-0000  |
    Then no new entry should be created under user 123