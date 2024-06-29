import { type Locator, type Page, expect } from "@playwright/test";
import { formatPkh } from "@umami/tezos";

import { type Account, type AccountGroup } from "../helpers/AccountGroup";

export class AccountsPage {
  constructor(readonly page: Page) {}

  async getTotalBalance(): Promise<string> {
    return this.page.getByTestId("total-balance").getByRole("heading", { level: 2 }).innerText();
  }

  async openAccountDrawer(accountLabel: string): Promise<void> {
    await this.getAccountCard(accountLabel).click();
  }

  getAccountCard(accountLabel: string): Locator {
    return this.page
      .getByTestId("account-tile-container")
      .filter({ has: this.page.getByRole("heading", { name: accountLabel, exact: true }) });
  }

  async getAccountInfo(
    accountLabel: string
  ): Promise<{ balance: string; shortAddress: string; delegationStatus: boolean }> {
    const accountCard = this.getAccountCard(accountLabel);

    return {
      balance: await accountCard.getByTestId("balance").innerText(),
      shortAddress: await accountCard.getByTestId("short-address").innerText(),
      delegationStatus: "Delegated" === (await accountCard.getByTestId("is-delegated").innerText()),
    };
  }

  async getGroup(groupTitle: string): Promise<AccountGroup> {
    const group = this.page.getByTestId(`account-group-${groupTitle}`);

    const label = await group.getByTestId("account-group-title").innerText();

    const accountTiles = await group.getByTestId("account-identifier").all();
    const accounts: Account[] = [];
    for (const accountTile of accountTiles) {
      const name = await accountTile.getByRole("heading", { level: 2 }).innerText();
      const pkh = await accountTile.getByTestId("short-address").innerText();

      // pkh here will be a shortened version of the real pkh
      accounts.push({ name, pkh });
    }

    const groupType = /Secret Key/.test(label) ? "secret_key" : "mnemonic";

    return {
      type: groupType,
      label,
      accounts,
    };
  }

  async checkAccountGroup(expectedGroup: AccountGroup): Promise<void> {
    const group = await this.getGroup(expectedGroup.label);

    expect(group.label).toEqual(expectedGroup.label);
    expect(group.accounts.length).toEqual(expectedGroup.accounts.length);
    for (let i = 0; i < group.accounts.length; i++) {
      expect(group.accounts[i].name).toEqual(expectedGroup.accounts[i].name);
      expect(group.accounts[i].pkh).toEqual(formatPkh(expectedGroup.accounts[i].pkh));
    }
  }
}
