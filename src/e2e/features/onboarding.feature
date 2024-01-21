Feature: User Onboarding

  Scenario: User creates a new seed phrase account
    Given I am on the welcome page

    When I click "Get started" button
    Then I am on "Accept to Continue" onboarding page

    When I check "I confirm that I have read" checkbox
    And I click "Continue" button
    Then I am on "Connect or Create Account" onboarding page

    When I onboard with "Group A" "mnemonic" account group of size 1
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

    When I fill account name with "<accountName>"
    When I click "Continue" button
    Then I am on "Derivation Path" onboarding page

    When I select "<derivationPath>" as derivationPath
    When I click "Continue" button
    Then I am on "Umami Master Password" onboarding page

    When I fill "Password" with "12345678"
    And I fill "Confirm Password" with "12345678"
    And I click "Submit" button
    Then I am on an Accounts page
    And I see a toast "Account successfully created!"
    And I have "Group A" account group

    Examples:
      | accountName | derivationPath     |
      |             | Default            |
      |             | 44'/1729'/?'/0'/0' |
      | TestAccount | Default            |
      | TestAccount | 44'/1729'/?'/0'/0' |

  Scenario: User creates an account with existing seedphrase
    Given I am on the welcome page

    When I click "Get started" button
    Then I am on "Accept to Continue" onboarding page

    When I check "I confirm that I have read" checkbox
    And I click "Continue" button
    Then I am on "Connect or Create Account" onboarding page

    When I onboard with "Group A" "mnemonic" account group of size 1
    When I click "I already have a wallet" button
    Then I am on "Connect or Import Account" onboarding page

    When I click "Import with Seed Phrase" button
    Then I am on "Import Seed Phrase" onboarding page

    When I enter existing seedphrase
    And I click "Continue" button
    Then I am on "Name Your Account" onboarding page

    When I fill account name with "<accountName>"
    When I click "Continue" button
    Then I am on "Derivation Path" onboarding page

    When I select "<derivationPath>" as derivationPath
    When I click "Continue" button
    Then I am on "Umami Master Password" onboarding page

    When I fill "Password" with "12345678"
    And I fill "Confirm Password" with "12345678"
    And I click "Submit" button
    Then I am on an Accounts page
    And I see a toast "Account successfully created!"
    And I have "Group A" account group

    Examples:
      | accountName | derivationPath     |
      |             | Default            |
      |             | 44'/1729'/?'/0'/0' |
      | TestAccount | Default            |
      | TestAccount | 44'/1729'/?'/0'/0' |

  Scenario: User creates an account with existing seedphrase - through create new page
    Given I am on the welcome page

    When I click "Get started" button
    Then I am on "Accept to Continue" onboarding page

    When I check "I confirm that I have read" checkbox
    And I click "Continue" button
    Then I am on "Connect or Create Account" onboarding page

    When I onboard with "Group A" "mnemonic" account group of size 1
    When I click "Create a new Account" button
    Then I am on "Important Notice" onboarding page

    When I click "I already have a Seed Phrase" button
    Then I am on "Import Seed Phrase" onboarding page

    When I enter existing seedphrase
    And I click "Continue" button
    Then I am on "Name Your Account" onboarding page

    When I fill account name with "<accountName>"
    When I click "Continue" button
    Then I am on "Derivation Path" onboarding page

    When I select "<derivationPath>" as derivationPath
    When I click "Continue" button
    Then I am on "Umami Master Password" onboarding page

    When I fill "Password" with "12345678"
    And I fill "Confirm Password" with "12345678"
    And I click "Submit" button
    Then I am on an Accounts page
    And I see a toast "Account successfully created!"
    And I have "Group A" account group

    Examples:
      | accountName | derivationPath     |
      |             | Default            |
      |             | 44'/1729'/?'/0'/0' |
      | TestAccount | Default            |
      | TestAccount | 44'/1729'/?'/0'/0' |

  Scenario: User imports existing secret key account
    Given I am on the welcome page

    When I click "Get started" button
    Then I am on "Accept to Continue" onboarding page

    When I check "I confirm that I have read" checkbox
    And I click "Continue" button
    Then I am on "Connect or Create Account" onboarding page

    When I onboard with "Group A" "secret_key" account group of size 1
    When I click "I already have a wallet" button
    Then I am on "Connect or Import Account" onboarding page

    When I click "Import with Secret Key" button
    Then I am on "Insert Secret Key" onboarding page

    When I fill secret key with "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"
    And I click "Continue" button
    Then I am on "Name Your Account" onboarding page

    When I fill account name with "<accountName>"
    When I click "Continue" button
    Then I am on "Umami Master Password" onboarding page

    When I fill "Password" with "12345678"
    And I fill "Confirm Password" with "12345678"
    And I click "Submit" button
    Then I am on an Accounts page
    And I see a toast "Account successfully created!"
    And I have "Group A" account group

    Examples:
      | accountName |
      |             |
      | TestAccount |

  @focus
  Scenario: User imports a backup file
    Given I am on the welcome page

    When I click "Get started" button
    Then I am on "Accept to Continue" onboarding page

    When I check "I confirm that I have read" checkbox
    And I click "Continue" button
    Then I am on "Connect or Create Account" onboarding page

    When I click "I already have a wallet" button
    Then I am on "Connect or Import Account" onboarding page

    When I click "Restore from Backup" button
    Then I am on "Restore from Backup" onboarding page

    When I upload "<fileName>" backup file
    And I fill "Your password (if you have one)" with "<password>"
    And I click "Import Wallet" button
    Then I am on an Accounts page
    And I have groups matching "<fileName>" backup file

    Examples:
      | fileName      | password  |
      | V1Backup.json | asdfasdf  |
      | V2Backup.json | 123123123 |
