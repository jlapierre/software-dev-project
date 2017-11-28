# Created by Jenny at 11/23/2017
Feature: Get current user

  Scenario: Get current user            |
    Given the following users are in the database:
    | ID  | auth_role   |
    | 777 | STUDENT     |
    And user 777 is logged in
    When I get the current user
    Then it should return the following user
    | ID  | auth_role   |
    | 777 | STUDENT     |