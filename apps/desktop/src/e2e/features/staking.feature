Feature: Staking

  # TODO:
  # change delegate via round button
  # change delegate via edit button on earn page
  # stake
  # stake - unstake
  # stake - unstake - finalize unstake
  Scenario: I delegate to a baker
    Given I have account
      | type       | label | secretKey                                              | password |
      | secret_key | Alice | edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq | 12345678 |
    And I am on an Accounts page
    When I open account drawer for "Alice"
    And I delegate to "baker1"
    Then I see "Operation Submitted" modal
    When I close modal
    And I wait for TZKT to process the updates
    And I refetch the data in the background
    Then their delegate is "baker1"
    When I close drawer
    Then I see Alice is delegating

  Scenario: I undelegate
    Given I have account
      | type       | label | secretKey                                              | password |
      | secret_key | Alice | edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq | 12345678 |
    And I am on an Accounts page
    When I open account drawer for "Alice"
    And I delegate to "baker1"
    Then I see "Operation Submitted" modal
    When I close modal
    And I wait for TZKT to process the updates
    And I refetch the data in the background
    And I open "Earn" drawer tab
    And I undelegate
    Then I see "Operation Submitted" modal
    When I close modal
    And I wait for TZKT to process the updates
    And I refetch the data in the background
    Then their delegate is not set
    When I close drawer
    Then I see Alice is not delegating

  Scenario: I stake to a baker
    Given I have account
      | type       | label | secretKey                                              | password |
      | secret_key | Alice | edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq | 12345678 |
    And I am on an Accounts page
    Given baker "baker1" sets delegation parameters
      | limit-of-staking-over-baking | 5    |
      | edge-of-baking-over-staking  | 0.15 |
    When I open account drawer for "Alice"
    And I delegate to "baker1"
    Then I see "Operation Submitted" modal
    When I wait for TZKT to process the updates
    And I close modal
    And I close drawer
    And I refetch the data
    Then I see Alice is delegating
    When I open account drawer for "Alice"
    Then their delegate is "baker1"
    When I wait until "baker1" has no pending staking parameters
    And I stake 100 tez
    Then I see "Operation Submitted" modal
    When I close modal
    And I wait for TZKT to process the updates
    And I refetch the data in the background


# TODO: introduce a way to properly wait for the operation to be included & indexed
# Then I am staking 100 tez