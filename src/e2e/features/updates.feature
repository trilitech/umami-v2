Feature: Automatic updates

  Scenario: My account has been topped-up
    Given I have account
      | type       | label     | password | secretKey                                              |
      | secret_key | Account 1 | 12345678 | spsk2jm29sHC99HDi64VBpSwEMZRQ7WfHdvQPVMZCkyWyR4spBrtRW |
    And I am on an Accounts page
    When "Account 1" is topped-up with "1.123"
    And I wait until the next refetch
    Then "Account 1" balance should be "1.123000 ꜩ"
    And Total balance should be "1.123000 ꜩ"
