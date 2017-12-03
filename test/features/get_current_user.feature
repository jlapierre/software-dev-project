# Created by Jenny at 11/23/2017
Feature: Get user from email

  Scenario: Get user from email
    Given the following users are in the database:
    | _id | auth_role   | email               |
    | 777 | STUDENT     | doe.j@husky.neu.edu |
    When I get the user with email doe.j@husky.neu.edu
    Then it should return the following user
    | _id | auth_role   | email               |
    | 777 | STUDENT     | doe.j@husky.neu.edu |