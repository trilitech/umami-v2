import { DataTable, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { CustomWorld } from "./world";
import { formatPkh } from "../../utils/format";
import { AccountsPage } from "../pages/accounts";
import { CreateMultisigPage } from "../pages/CreateMultisigPage";

let page: CreateMultisigPage;

When("I am creating a multisig account", async function (this: CustomWorld) {
  await this.page.getByRole("button", { name: "Create New Multisig" }).click();
  page = new CreateMultisigPage(this.page);
});

When("I fill signers with", async function (this: CustomWorld, table: DataTable) {
  const rows = table.raw();
  for (let i = 0; i < rows.length; i++) {
    const signer = rows[i][0];
    await page.setSigner(i, signer);
  }
});

Then("I see multisig confirmation page", async function (this: CustomWorld, table: DataTable) {
  const data = table.rowsHash();
  expect(this.page.getByTestId("contract-name")).toContainText(data["Contract Name"]);
  expect(this.page.getByTestId("multisig-owner")).toContainText(data["Owner"]);

  const signers = data["Approvers"].split(",");
  expect(this.page.getByTestId(/approver-/)).toHaveCount(signers.length);

  const approvers = this.page.getByTestId("approvers");
  for (const signer of signers) {
    expect(
      approvers
        .getByText(signer, { exact: true })
        .or(approvers.getByText(formatPkh(signer), { exact: true }))
    ).toBeVisible();
  }

  expect(this.page.getByTestId("threshold")).toContainText(data["Min No. of approvals"]);
});

// TODO: Add address validation
Then("I see {string} multisig account", async function (this: CustomWorld, name: string) {
  const multisigAccounts = await new AccountsPage(this.page).getGroup("Multisig Accounts");
  expect(multisigAccounts.accounts.map(a => a.label)).toContain(name);
});
