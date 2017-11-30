# Created by Jenny at 11/24/2017
# Feature: get_partners

  Scenario: no partners in db
    Given there are no partners in the database
    When I get all partners from the database
    Then it should return an empty list

  Scenario: one partner in db
    Given the following partners are in the database:
    | ID  | name      | core_community_partner |
    | 444 | Partner 1 | true                   |
    When I get all partners from the database
    Then it should return the following partners
    | ID  | name      | core_community_partner |
    | 444 | Partner 1 | true                   |

  Scenario: multiple partners in db
    Given the following partners are in the database:
    | ID  | name      | core_community_partner |
    | 444 | Partner 1 | true                   |
    | 555 | Partner 2 | false                  |
    When I get all partners from the database
    Then it should return the following partners
    | ID  | name      | core_community_partner |
    | 444 | Partner 1 | true                   |
    | 555 | Partner 2 | false                  |