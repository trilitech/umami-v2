import { type DataTable, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { minutesToMilliseconds } from "date-fns";

import { type CustomWorld } from "./world";
import { DEFAULT_ACCOUNTS } from "../constants";
import { AccountDrawerPage } from "../pages/AccountDrawerPage";
import { AccountsPage } from "../pages/AccountsPage";
import { AddressPillPage } from "../pages/AddressPillPage";
import { runDockerCommand } from "../utils";

Given(
  "baker {string} sets delegation parameters",
  function (this: CustomWorld, baker: string, params: DataTable) {
    let command = `exec -it tezos_node octez-client set delegate parameters for ${baker} `;

    command += Object.entries(params.rowsHash())
      .map(([key, value]) => `--${key} ${value}`)
      .join(" ");

    runDockerCommand(command);
  }
);

When("I delegate to {string}", async function (this: CustomWorld, baker: string) {
  await new AccountDrawerPage(this.page).delegateTo(baker);
});

Then(
  /^I see (.*) is (not )?delegating$/,
  async function (this: CustomWorld, accountLabel: string, notDelegating: string) {
    const { delegationStatus } = await new AccountsPage(this.page).getAccountInfo(accountLabel);
    expect(delegationStatus).toEqual(!notDelegating);
  }
);

Then("their delegate is {string}", async function (this: CustomWorld, baker: string) {
  await expect(new AccountDrawerPage(this.page).delegationStatus).toHaveText(/Active/);

  const bakerPill = new AccountDrawerPage(this.page).baker;
  await expect(new AddressPillPage(bakerPill).address).toHaveText(DEFAULT_ACCOUNTS[baker].pkh);
});

Then("their delegate is not set", async function (this: CustomWorld) {
  await expect(new AccountDrawerPage(this.page).delegationStatus).toHaveText(/Inactive/);
});

When("I undelegate", async function (this: CustomWorld) {
  await new AccountDrawerPage(this.page).undelegate();
});

When(
  "I wait until {string} has no pending staking parameters",
  { timeout: minutesToMilliseconds(2) },
  async function (this: CustomWorld, baker: string) {
    const bakerAddress = DEFAULT_ACCOUNTS[baker].pkh;
    const command =
      "exec -it tezos_node octez-client rpc get " +
      `chains/main/blocks/head/context/delegates/${bakerAddress}/pending_staking_parameters`;

    while (JSON.parse(runDockerCommand(command, "pipe")).length) {
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await this.page.waitForTimeout(5000);
    }
  }
);

When("I stake {int} tez", async function (this: CustomWorld, amount: number) {
  await new AccountDrawerPage(this.page).stake(amount);
});

Then("I am staking {int} tez", async function (this: CustomWorld, amount: number) {
  expect(await new AccountDrawerPage(this.page).stakedBalance()).toEqual(amount);
});
