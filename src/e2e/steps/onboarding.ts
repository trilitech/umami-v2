import path from "path";

import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { CustomWorld } from "./world";
import { mnemonic1 as existingSeedphrase } from "../../mocks/mockMnemonic";
import { DEFAULT_DERIVATION_PATH } from "../../utils/account/derivationPathUtils";
import { formatPkh } from "../../utils/format";
import { AccountGroupBuilder } from "../helpers/accountGroup";
import { AccountsPage } from "../pages/accounts";

export const BASE_URL = "http://127.0.0.1:3000";

let accountGroupBuilder: AccountGroupBuilder;
const newGroups: Record<string, AccountGroupBuilder> = {};

let accountsPage: AccountsPage;

// TODO: make custom Given with `this` defined as `CustomWorld`
Given("I am on the welcome page", async function (this: CustomWorld) {
  this.setEmptyReduxState();
  await this.pageReady;
  await this.page.goto(`${BASE_URL}/`);
});

Then("I am on {string} onboarding page", async function (this: CustomWorld, modalTitle) {
  const title = this.page.getByRole("heading", { name: modalTitle });
  expect(title).toBeVisible();
});

Then("I record generated seedphrase", async function (this: CustomWorld) {
  const words: string[] = [];
  for (let i = 0; i < 24; i++) {
    words.push(await this.page.getByTestId(`mnemonic-word-${i}`).innerText());
  }
  await accountGroupBuilder.setSeedPhrase(words);
});

When("I enter recorded seedphrase", async function (this: CustomWorld) {
  for (let i = 0; i < 5; i++) {
    const wordIndex = Number(await this.page.getByTestId("mnemonic-index").nth(i).innerText()) - 1;
    await this.page
      .getByRole("textbox")
      .nth(i)
      .fill(accountGroupBuilder.getSeedPhrase()[wordIndex]);
    // TODO: maybe keep it here and not in the builder?
  }
});

When("I enter existing seedphrase", async function (this: CustomWorld) {
  await accountGroupBuilder.setSeedPhrase(existingSeedphrase.split(" "));
  for (let i = 0; i < 24; i++) {
    await this.page.getByRole("textbox").nth(i).fill(accountGroupBuilder.getSeedPhrase()[i]);
  }
});

When("I select {string} as derivationPath", async function (this: CustomWorld, derivationPath) {
  if (derivationPath === "Default") {
    accountGroupBuilder.setDerivationPathPattern(DEFAULT_DERIVATION_PATH.value);
    return;
  }
  await this.page.getByTestId("select-input").click();
  await this.page.getByTestId("select-options").getByText(derivationPath).click();
  accountGroupBuilder.setDerivationPathPattern(derivationPath);
});

When("I fill secret key with {string}", async function (this: CustomWorld, secretKey) {
  await this.page.getByLabel("Secret Key", { exact: true }).fill(secretKey);

  await accountGroupBuilder.setSecretKey(secretKey);
});

When("I fill account name with {string}", async function (this: CustomWorld, accountName) {
  await this.page.getByLabel("Account name", { exact: true }).fill(accountName);
  accountGroupBuilder.setAllAccountNames(accountName);
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
  "I onboard with {string} {string} account group with size {int}",
  async function (this: CustomWorld, groupName, groupType, accountsAmount) {
    accountGroupBuilder = new AccountGroupBuilder(groupType, accountsAmount);
    newGroups[groupName] = accountGroupBuilder;
  }
);

Then("I have {string} account group", async function (this: CustomWorld, groupName) {
  const expectedGroup = await newGroups[groupName].build();
  const accountsGroup = await accountsPage.getGroup(expectedGroup.groupTitle);

  expect(accountsGroup.label).toEqual(expectedGroup.groupTitle);
  expect(accountsGroup.accounts.length).toEqual(expectedGroup.accounts.length);
  for (let i = 0; i < accountsGroup.accounts.length; i++) {
    expect(accountsGroup.accounts[i].label).toEqual(expectedGroup.accounts[i].name);
    expect(accountsGroup.accounts[i].address).toEqual(formatPkh(expectedGroup.accounts[i].pkh));
  }
});

Then("I see a toast {string}", async function (this: CustomWorld, toastMessage) {
  const toast = this.page.getByRole("status").getByText(toastMessage);
  expect(toast).toBeVisible();
});
