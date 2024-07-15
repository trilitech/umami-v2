import { When } from "@cucumber/cucumber";

import { type CustomWorld } from "./world";
import { AccountDrawerPage } from "../pages/AccountDrawerPage";
import { AccountsPage } from "../pages/AccountsPage";

When(
  "I open account drawer for {string}",
  async function (this: CustomWorld, accountLabel: string) {
    await new AccountsPage(this.page).openAccountDrawer(accountLabel);
  }
);

When("I open {string} drawer tab", async function (this: CustomWorld, tabName: string) {
  await new AccountDrawerPage(this.page).openTab(tabName);
});
