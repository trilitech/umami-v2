Feature: Multisig Account Creation

  Scenario: User creates a multisig account
    Given I have account
      | type       | label | secretKey                                              | password            |
      | secret_key | Alice | edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq | Qwerty123123!23vcxz |
    And I am on an Accounts page

    When I am creating a multisig account
    Then I see "Account Name" modal

    When I fill "Account Name" with "My Multisig Account"
    And I click "Continue" button
    Then I see "Select Approvers" modal

    When I fill approvers with
      | Alice                                |
      | tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h |
    And I fill "Min No. of approvals:" with "1"
    And I click "Review" button

    Then I see "Review & Submit" modal
    And I see multisig confirmation page
      | Contract Name        | My Multisig Account                        |
      | Approvers            | Alice,tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h |
      | Min No. of approvals | 1                                          |

    When I sign transaction with password "Qwerty123123!23vcxz"
    Then I see "Operation Submitted" modal

    And I close modal
    When I wait for TZKT to process the updates
    And I refetch the data


# this is a flaky step
# TODO: fix multisig name assignment
# Then I see "My Multisig Account" multisig account