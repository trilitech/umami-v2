Feature: User Onboarding

  Scenario: User creates a new account
    Given I am on the welcome page

    When I click "Get started" button
    Then I am on "Accept to Continue" onboarding page

    When I check "I confirm that I have read" checkbox
    And I click "Continue" button
    Then I am on "Connect or Create Account" onboarding page

    When I onboard with "Account A" mnemonic account
    When I click "Create a new Account" button
    Then I am on "Important Notice" onboarding page

    When I click "I understand" button
    Then I am on "Record Seed Phrase" onboarding page
    And I record generated seedphrase

    When I click "OK, I've recorded it" button
    Then I am on "Verify Seed Phrase" onboarding page

    When I enter recorded seedphrase
    And I click "Continue" button
    Then I am on "Name Your Account" onboarding page

    When I click "Continue" button
    Then I am on "Derivation Path" onboarding page

    When I click "Continue" button
    Then I am on "Umami Master Password" onboarding page

    When I fill "Password" with "12345678"
    And I fill "Confirm Password" with "12345678"
    And I click "Submit" button
    Then I am on an Accounts page
    And I see a toast "Account successfully created!"
    And I have "Account A" account
