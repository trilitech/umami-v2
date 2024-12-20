import { type DataTable, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { type Account } from "@umami/core";
import { type AccountsState, makeSecretKeyAccount } from "@umami/state";
import { BLOCK_TIME } from "@umami/tezos";
import { getOperationsByHash } from "@umami/tzkt";
import { CustomError } from "@umami/utils";
import { minutesToMilliseconds } from "date-fns";
import { some } from "lodash";

import { BASE_URL } from "./onboarding";
import { type CustomWorld } from "./world";
import { TEST_NETWORK } from "../constants";
import { AccountsPage } from "../pages/AccountsPage";
import { SignPage } from "../pages/SignPage";
import { refetch, runDockerCommand, topUpAccount, waitUntilRefetch } from "../utils";

Given(/I have accounts?/, async function (this: CustomWorld, table: DataTable) {
  const accounts: AccountsState = {
    items: [],
    seedPhrases: {},
    secretKeys: {},
    alerts: {
      isSocialLoginWarningShown: false,
      isExtensionsWarningShown: false,
    },
  };

  for (const data of table.hashes() as any[]) {
    if (data.type === "secret_key") {
      const { account, encryptedSecretKey } = await makeSecretKeyAccount(data);

      accounts.items.push(account);
      accounts.secretKeys[account.address.pkh] = encryptedSecretKey;
    } else {
      throw new CustomError(`${data.type} account is not supported yet`);
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
  await expect(this.modal.getByRole("heading", { name: modalTitle, exact: false })).toBeVisible();

  if (modalTitle === "Operation Submitted") {
    const lastOperationHash = await this.modal
      .getByRole("link", { name: "View in TzKT" })
      .getAttribute("href");
    this.lastOperationHash = lastOperationHash!.split("/").reverse()[0];
  }
});

When("I check {string} checkbox", async function (this: CustomWorld, checkboxName) {
  await this.page.getByText(checkboxName).click();
});

When("I sign transaction with password {string}", async function (this: CustomWorld, password) {
  await new SignPage(this.page, password).sign();
});

When("I close modal", async function (this: CustomWorld) {
  await this.modal.getByRole("button", { name: "Close", exact: true }).click();
  await expect(this.modal).not.toBeAttached();
});

When("I close drawer", async function (this: CustomWorld) {
  await this.page.getByTestId("close-drawer-button").click();
  await expect(this.drawer).not.toBeAttached();
});

When(
  "I wait for TZKT to process the updates",
  { timeout: minutesToMilliseconds(1) },
  async function (this: CustomWorld) {
    if (this.lastOperationHash) {
      let operations: any[] = [];
      do {
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await this.page.waitForTimeout(1000);
        operations = await getOperationsByHash(this.lastOperationHash, TEST_NETWORK);
      } while (operations.length === 0 || some(operations, op => op.status !== "applied"));

      return;
    }

    // Wait for 2 blocks to be applied
    const getLastAppliedBlock = () => {
      const logs = runDockerCommand("logs sync", "pipe").toString().split("\n").reverse();
      for (const log of logs) {
        const matches = log.match(/Applied (\d+) of \d+/);
        if (matches) {
          return matches[1];
        }
      }
      throw new CustomError("TZKT sync last applied block not found");
    };

    for (let i = 0; i < 2; i++) {
      const previous = getLastAppliedBlock();

      while (getLastAppliedBlock() === previous) {
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await this.page.waitForTimeout(100);
      }
    }
  }
);

When(
  /I refetch the data( in the background)?/,
  async function (this: CustomWorld, inBackground: string) {
    await refetch(this.page, !!inBackground);
  }
);

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
