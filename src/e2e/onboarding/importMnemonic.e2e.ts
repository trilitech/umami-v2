import { expect, test } from "@playwright/test";

import { mnemonic1 as mnemonic } from "../../mocks/mockMnemonic";
import { AVAILABLE_DERIVATION_PATHS } from "../../utils/account/derivationPathUtils";
import { cleanupState, onboardWithExistingMnemonic } from "../utils";

cleanupState();

test.describe("Import Mnemonic", () => {
  test("First account restore", async ({ page }) => {
    await onboardWithExistingMnemonic({ mnemonic, page });

    await expect(page.getByTestId("account-group-Seedphrase 5fd091e1")).toBeVisible();

    const accountTile = page.getByTestId("account-tile-tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3");
    await expect(accountTile).toBeVisible();
    await expect(accountTile.getByRole("heading", { name: "Account" })).toBeVisible();
    await expect(accountTile.getByText("tz1UN...oBUB3")).toBeVisible();
  });

  test("with custom derivation path", async ({ page }) => {
    await onboardWithExistingMnemonic({
      mnemonic,
      page,
      derivationPath: AVAILABLE_DERIVATION_PATHS[2].value,
    });

    await expect(page.getByTestId("account-group-Seedphrase 5fd091e1")).toBeVisible();

    const accountTile = page.getByTestId("account-tile-tz1axS1muWwWD6J6cL8EuXjvhypMkNs2EHGz");
    await expect(accountTile).toBeVisible();
    await expect(accountTile.getByRole("heading", { name: "Account" })).toBeVisible();
    await expect(accountTile.getByText("tz1ax...2EHGz")).toBeVisible();
  });
});
