import { expect, test } from "@playwright/test";

import { AliceAccount, MASTER_PASSWORD, cleanupState } from "../utils";

cleanupState();

test("Import secret key", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Get started" }).click();

  expect(page.getByRole("heading", { name: "Accept to Continue" })).toBeVisible();
  await page.getByText(/I confirm/).click();

  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I already have a wallet" }).click();
  await page.getByRole("button", { name: "Import with Secret Key" }).click();

  await page.getByRole("textbox").fill(AliceAccount.secretKey);
  await page.getByRole("button", { name: "Continue" }).click();

  expect(page.getByRole("heading", { name: "Name Your Account" })).toBeVisible();
  await page.getByRole("textbox").fill("Alice");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByTestId("password").fill(MASTER_PASSWORD);
  page.getByLabel("Confirm Password").fill(MASTER_PASSWORD);

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("/#/home");

  await expect(page.getByTestId("account-group-Secret Key Accounts")).toBeVisible();

  const accountTile = page.getByTestId(`account-tile-${AliceAccount.pkh}`);
  await expect(accountTile).toBeVisible();
  await expect(accountTile.getByRole("heading", { name: "Alice" })).toBeVisible();
  await expect(accountTile.getByText("tz1VS...Cjcjb")).toBeVisible();
});
