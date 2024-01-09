import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { BASE_URL } from "./onboarding";
import { CustomWorld } from "./world";
import { State } from "../../utils/redux/slices/accountsSlice";
import { makeSecretKeyAccount } from "../../utils/redux/thunks/secretKeyAccount";

Given(/I have accounts?/, async function (this: CustomWorld, table: DataTable) {
  const accounts: State = {
    items: [],
    seedPhrases: {},
    secretKeys: {},
  };

  for (const data of table.hashes() as any[]) {
    if (data.type === "secret_key") {
      const { account, encryptedSecretKey } = await makeSecretKeyAccount(data);

      accounts.items.push(account);
      accounts.secretKeys[account.address.pkh] = encryptedSecretKey;
    } else {
      throw new Error(`${data.type} account is not supported yet`);
    }
  }
  this.setReduxState({ accounts });

  await this.pageReady;
  await this.page.goto(`${BASE_URL}/`);
});

When("I click {string} button", async function (this: CustomWorld, buttonName) {
  await this.page.getByRole("button", { name: buttonName }).click();
});

When("I fill {string} with {string}", async function (this: CustomWorld, inputLabel, inputValue) {
  await this.page.getByLabel(inputLabel, { exact: true }).fill(inputValue);
});

When(
  "I fill {string} address field with {string}",
  async function (this: CustomWorld, inputLabel, inputValue) {
    await this.page.getByText(inputLabel, { exact: true }).fill(inputValue);
  }
);

Then("I see {string} modal", async function (this: CustomWorld, modalTitle) {
  expect(this.page.getByRole("heading", { name: modalTitle, exact: false })).toBeVisible();
});

When("I check {string} checkbox", async function (this: CustomWorld, checkboxName) {
  await this.page.getByText(checkboxName).click();
});

When("I sign transaction with password {string}", async function (this: CustomWorld, password) {
  await this.page.getByLabel("Password", { exact: true }).fill(password);
  await this.page.getByRole("button", { name: /^(Confirm|Propose) (Transaction|Batch)$/ }).click();
});

When("I close modal", async function (this: CustomWorld) {
  await this.page.getByRole("button", { name: "Close", exact: true }).click();
});

When("I wait for TZKT to process the updates", async function (this: CustomWorld) {
  await this.page.waitForTimeout(3000);
});

When("I refetch the data", async function (this: CustomWorld) {
  await this.page.getByTestId("refetch-button").click();
  expect(this.page.getByText("Updated just now")).toBeVisible();
});
