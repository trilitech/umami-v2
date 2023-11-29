import { expect, test } from "@playwright/test";

import { cleanupState, onboardWithExistingMnemonic, refetch, topUpAccount } from "./utils";
import { mnemonic1 as mnemonic } from "../mocks/mockMnemonic";

cleanupState();

test("Account top-up shows up automatically", async ({ page }) => {
  await onboardWithExistingMnemonic({ mnemonic, page });

  const accountTile = page.getByTestId("account-tile-tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3");
  await expect(accountTile.getByText("1.123000 ꜩ")).not.toBeVisible();

  await topUpAccount("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3", "1.123");
  await refetch(page);

  await expect(accountTile.getByText("1.123000 ꜩ")).toBeVisible();
});
