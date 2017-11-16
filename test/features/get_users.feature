Feature: Get users

    Scenario: student is logged in
        Given the following users are in the database:
        | ID  | auth_role |
        | 123 | STUDENT  |
        | 456 | STUDENT  |
        And user 123 is logged in
        When I call get_users
        Then it should return an empty list

    Scenario: admin is logged in
        Given the following users are in the database:
        | ID  | auth_role    |
        | 123 | STUDENT     |
        | 456 | STUDENT     |
        | 999 | ADMIN       |
        | 777 | PEER LEADER |
        | 888 | PEER LEADER |
        And user 999 is logged in
        When I call get_users
        Then it should return the following users:
        | ID  | auth_role    |
        | 123 | STUDENT     |
        | 456 | STUDENT     |
        | 999 | ADMIN       |
        | 777 | PEER LEADER |
        | 888 | PEER LEADER |

    Scenario: peer leader with no students
        Given the following users are in the database:
        | ID  | auth_role   |
        | 123 | STUDENT     |
        | 456 | STUDENT     |
        | 999 | ADMIN       |
        | 777 | PEER LEADER |
        | 888 | PEER LEADER |
        And the following peer leader relationships exist:
        | ID  | peerLeader |
        | 123 | 888        |
        And user 777 is logged in
        When I call get_users
        Then it should return an empty list

    Scenario: peer leader with one student
        Given the following users are in the database:
        | ID  | auth_role    |
        | 123 | STUDENT     |
        | 456 | STUDENT     |
        | 999 | ADMIN       |
        | 777 | PEER LEADER |
        | 888 | PEER LEADER |
        And the following peer leader relationships exist:
        | ID  | peerLeader |
        | 123 | 888        |
        And user 888 is logged in
        When I call get_users
        Then it should return the following users:
        | ID  | auth_role    |
        | 123 | STUDENT     |
        | 888 | PEER LEADER |

    Scenario: peer leader with multiple students
        Given the following users are in the database:
        | ID  | auth_role    |
        | 123 | STUDENT     |
        | 456 | STUDENT     |
        | 999 | ADMIN       |
        | 777 | PEER LEADER |
        | 888 | PEER LEADER |
        And the following peer leader relationships exist:
        | ID  | peerLeader |
        | 123 | 888        |
        | 456 | 888        |
        And user 888 is logged in
        When I call get_users
        Then it should return the following users:
        | ID  | auth_role    |
        | 123 | STUDENT     |
        | 456 | STUDENT     |
        | 888 | PEER LEADER |