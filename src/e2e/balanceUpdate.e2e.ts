import { test, expect } from "@playwright/test";
import { cleanupState, loginAs, refetch, resetBlockchain, topUpAccount } from "./utils";
import { mnemonic1 } from "../mocks/mockMnemonic";

cleanupState();
test.beforeEach(resetBlockchain);

test("Account top-up shows up automatically", async ({ page }) => {
  await loginAs(mnemonic1, page);

  const accountTile = page.getByTestId("account-tile-tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3");
  await expect(accountTile.getByText("1.123000 ꜩ")).not.toBeVisible();

  await topUpAccount("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3", "1.123");
  await refetch(page);

  await expect(accountTile.getByText("1.123000 ꜩ")).toBeVisible();
});
