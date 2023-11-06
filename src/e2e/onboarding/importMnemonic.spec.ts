import { test, expect } from "@playwright/test";
import { cleanupState, loginAs } from "../utils";
import { mnemonic1 } from "../../mocks/mockMnemonic";

cleanupState();

test.describe("Import Mnemonic", () => {
  test("First account restore", async ({ page }) => {
    await loginAs(mnemonic1, page);

    expect(page.getByTestId("account-group-Seedphrase 5fd091e1")).toBeVisible();

    const accountTile = page.getByTestId("account-tile-tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3");
    expect(accountTile).toBeVisible();
    expect(accountTile.getByRole("heading", { name: "Restored account 0" })).toBeVisible();
    expect(accountTile.getByText("tz1UN...oBUB3")).toBeVisible();
  });
});
