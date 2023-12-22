import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { CustomWorld } from "./world";
import { DEFAULT_DERIVATION_PATH } from "../../utils/account/derivationPathUtils";
import { formatPkh } from "../../utils/format";
import { AccountsPage } from "../pages/accounts";
import {
  AddAccountPage,
  AddMnemonicAccountPage,
  AddSecretKeyAccountPage,
} from "../pages/addAccount";

export const BASE_URL = "http://127.0.0.1:3000";

let addAccountPage: AddAccountPage;
let accountsPage: AccountsPage;
const newAccounts: Record<string, AddAccountPage> = {};

// TODO: make custom Given with `this` defined as `CustomWorld`
Given("I am on the welcome page", async function (this: CustomWorld) {
  await this.page.goto(`${BASE_URL}/`);
});

When("I click {string} button", async function (this: CustomWorld, buttonName) {
  await this.page.getByRole("button", { name: buttonName }).click();
});

Then("I am on {string} onboarding page", async function (this: CustomWorld, modalTitle) {
  const title = this.page.getByRole("heading", { name: modalTitle });
  expect(title).toBeVisible();
});

When("I check {string} checkbox", async function (this: CustomWorld, checkboxName) {
  await this.page.getByText(new RegExp(checkboxName)).click();
});

Then("I record generated seedphrase", async function (this: CustomWorld) {
  const words = [];
  for (let i = 0; i < 24; i++) {
    words.push(await this.page.getByTestId(`mnemonic-word-${i}`).innerText());
  }
  addAccountPage.seedPhrase = words;
});

When("I enter recorded seedphrase", async function (this: CustomWorld) {
  for (let i = 0; i < 5; i++) {
    const wordIndex = Number(await this.page.getByTestId("mnemonic-index").nth(i).innerText()) - 1;
    await this.page.getByRole("textbox").nth(i).fill(addAccountPage.seedPhrase[wordIndex]);
  }
});

When("I select {string} as derivationPath", async function (this: CustomWorld, derivationPath) {
  await this.page.getByTestId("select-input").click();
  await this.page.getByTestId("select-options").getByText(derivationPath).click();
  addAccountPage.derivationPath =
    derivationPath !== "Default" ? derivationPath : DEFAULT_DERIVATION_PATH.value;
});

When("I fill secret key with {string}", async function (this: CustomWorld, secretKey) {
  await this.page.getByLabel("Secret Key", { exact: true }).fill(secretKey);
  addAccountPage.secretKey = secretKey;
});

When("I fill account name with {string}", async function (this: CustomWorld, accountName) {
  await this.page.getByLabel("Account name", { exact: true }).fill(accountName);
  addAccountPage.namePrefix = accountName || "Account";
});

When("I fill {string} with {string}", async function (this: CustomWorld, inputLabel, inputValue) {
  await this.page.getByLabel(inputLabel, { exact: true }).fill(inputValue);
});

Then(/I am on an? (\w+) page/, async function (this: CustomWorld, pageName) {
  let route: string = `${BASE_URL}`;
  if (pageName === "Accounts") {
    accountsPage = new AccountsPage(this.page);
    route += "/#/home";
  }

  await this.page.waitForURL(route);
  const title = this.page.getByRole("heading", { name: pageName, exact: true });
  expect(title).toBeVisible();
});

When(
  "I onboard with {string} {string} account",
  async function (this: CustomWorld, accountName, accountType) {
    if (accountType === "mnemonic") {
      addAccountPage = new AddMnemonicAccountPage(this.page);
    } else if (accountType === "secret key") {
      addAccountPage = new AddSecretKeyAccountPage(this.page);
    }
    newAccounts[accountName] = addAccountPage;
  }
);

Then("I have {string} account", async function (this: CustomWorld, accountName) {
  const namePrefix = newAccounts[accountName].namePrefix;
  const groupTitle = await newAccounts[accountName].groupTitle();
  const pkh = await newAccounts[accountName].pkh();

  const accountsGroup = await accountsPage.getGroup(groupTitle);
  expect(accountsGroup.label).toEqual(groupTitle);

  expect(accountsGroup.accounts.length).toEqual(1);
  expect(accountsGroup.accounts[0].address).toEqual(formatPkh(pkh));
  expect(accountsGroup.accounts[0].label).toMatch(new RegExp(`^${namePrefix}`));
});

Then("I see a toast {string}", async function (this: CustomWorld, toastMessage) {
  const toast = this.page.getByRole("status").getByText(toastMessage);
  expect(toast).toBeVisible();
});
