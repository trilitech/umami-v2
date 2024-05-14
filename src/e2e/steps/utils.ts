import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { BASE_URL } from "./onboarding";
import { CustomWorld } from "./world";
import { Account } from "../../types/Account";
import { BLOCK_TIME } from "../../utils/dataPolling/constants";
import { State } from "../../utils/redux/slices/accountsSlice/State";
import { makeSecretKeyAccount } from "../../utils/redux/thunks/secretKeyAccount";
import { AccountsPage } from "../pages/AccountsPage";
import { refetch, runDockerCommand, topUpAccount, waitUntilRefetch } from "../utils";

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
  await expect(this.page.getByRole("heading", { name: modalTitle, exact: false })).toBeVisible();
});

When("I check {string} checkbox", async function (this: CustomWorld, checkboxName) {
  await this.page.getByText(checkboxName).click();
});

When("I sign transaction with password {string}", async function (this: CustomWorld, password) {
  await this.page.getByLabel("Password", { exact: true }).fill(password);
  await this.page
    .getByRole("button", { name: /^(Confirm|Propose|Submit) (Transaction|Batch|Contract)$/ })
    .click();
});

When("I close modal", async function (this: CustomWorld) {
  const modal = this.page.getByRole("dialog");
  await modal.getByRole("button", { name: "Close", exact: true }).click();
});

When("I wait for TZKT to process the updates", async function (this: CustomWorld) {
  const getLastAppliedBlock = () => {
    const logs = runDockerCommand("logs sync", "pipe").toString().split("\n").reverse();
    for (const log of logs) {
      const matches = log.match(/Applied (\d+) of \d+/);
      if (matches) {
        return matches[1];
      }
    }
    throw new Error("TZKT sync last applied block not found");
  };

  const previous = getLastAppliedBlock();

  for (;;) {
    await this.page.waitForTimeout(100);
    if (getLastAppliedBlock() !== previous) {
      break;
    }
  }
});

When("I refetch the data", async function (this: CustomWorld) {
  await refetch(this.page);
});

When(
  "{string} is topped-up with {string}",
  async function (this: CustomWorld, accountLabel, amount) {
    const pkh = ((await this.getReduxState()) as any).accounts.items.find(
      (acc: Account) => acc.label === accountLabel
    )?.address.pkh;
    await topUpAccount(pkh, amount);
  }
);

Then(
  "{string} balance should be {string}",
  async function (this: CustomWorld, accountLabel, amount) {
    const { balance } = await new AccountsPage(this.page).getAccountInfo(accountLabel);
    expect(balance).toEqual(amount);
  }
);

Then("Total balance should be {string}", async function (this: CustomWorld, amount) {
  const totalBalance = await new AccountsPage(this.page).getTotalBalance();
  expect(totalBalance).toEqual(amount);
});

When(
  "I wait until the next refetch",
  { timeout: BLOCK_TIME + 1000 },
  async function (this: CustomWorld) {
    await waitUntilRefetch(this.page);
  }
);
