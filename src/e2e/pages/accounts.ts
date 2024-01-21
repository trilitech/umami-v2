import { Page } from "@playwright/test";

import { RawPkh } from "../../types/Address";

type Account = {
  label: string;
  address: RawPkh;
};
type AccountGroup = {
  label: string;
  accounts: Account[];
};

export class AccountsPage {
  constructor(readonly page: Page) {}

  async getGroup(groupTitle: string): Promise<AccountGroup> {
    const group = this.page.getByTestId(`account-group-${groupTitle}`);

    const label = await group.getByTestId("account-group-title").innerText();

    const accountTiles = await group.getByTestId("account-identifier").all();
    const accounts: Account[] = [];
    for (const accountTile of accountTiles) {
      const label = await accountTile.getByRole("heading", { level: 2 }).innerText();
      const address = await accountTile.getByTestId("short-address").innerText();
      accounts.push({ label, address });
    }

    return {
      label,
      accounts,
    };
  }
}
