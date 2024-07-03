import { type DataTable, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { formatPkh } from "@umami/tezos";

import { type CustomWorld } from "./world";
import { AccountsPage } from "../pages/AccountsPage";
import { CreateMultisigPage } from "../pages/CreateMultisigPage";

When("I am creating a multisig account", async function (this: CustomWorld) {
  await this.page.getByRole("button", { name: "Create New Multisig" }).click();
});

When("I fill approvers with", async function (this: CustomWorld, table: DataTable) {
  const page = new CreateMultisigPage(this.page);
  const rows = table.raw();
  for (let i = 0; i < rows.length; i++) {
    const signer = rows[i][0];
    await page.setApprover(i, signer);
  }
});

Then("I see multisig confirmation page", async function (this: CustomWorld, table: DataTable) {
  const data = table.rowsHash();
  await expect(this.page.getByTestId("contract-name")).toContainText(data["Contract Name"]);

  const signers = data["Approvers"].split(",");
  await expect(this.page.getByTestId(/approver-/)).toHaveCount(signers.length);

  const approvers = this.page.getByTestId("approvers");
  for (const signer of signers) {
    await expect(
      approvers
        .getByText(signer, { exact: true })
        .or(approvers.getByText(formatPkh(signer), { exact: true }))
    ).toBeVisible();
  }

  await expect(this.page.getByTestId("threshold")).toContainText(
    `${data["Min No. of approvals"]} out of ${signers.length}`
  );
});

// TODO: Add address validation
Then("I see {string} multisig account", async function (this: CustomWorld, name: string) {
  const multisigAccounts = await new AccountsPage(this.page).getGroup("Multisig Accounts");
  expect(multisigAccounts.accounts.map(a => a.name)).toContain(name);
});
