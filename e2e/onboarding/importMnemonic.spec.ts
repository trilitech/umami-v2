import { test, expect } from '@playwright/test';
import { cleanupState } from '../utils';
import { mnemonic1 } from '../../src/mocks/mockMnemonic';

cleanupState()

test.describe("Import Mnemonic", () => {
  test("First account restore", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", {name: "Get started"}).click();

    expect(page.getByRole("heading", {name: "Accept to Continue"})).toBeVisible();
    await page.getByText(/I confirm/).click();

    await page.getByRole("button", {name: "Continue"}).click();
    await page.getByRole("button", {name: "I already have a wallet"}).click();
    await page.getByRole("button", {name: "Import with Seed Phrase"}).click();
    const words = mnemonic1.split(' ');
    for (let i = 0; i < words.length; i++) {
      await page.getByRole("textbox").nth(i).fill(words[i]);
    }

    await page.getByRole("button", {name: "Continue"}).click();
    expect(page.getByRole("heading", {name: "Derivation Path"})).toBeVisible();
    await page.getByRole("button", {name: "Continue"}).click();


    await page.getByTestId("password").fill("12345678");
    page.getByLabel("Confirm Password").fill("12345678");
    await page.getByRole("button", {name: "Submit"}).click();

    await page.waitForURL("/#/home")
    page.getByTestId("account-group-Seedphrase 5fd091e1");
    const accountTile = page.getByTestId('account-tile-tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3');
    accountTile.getByRole('heading', { name: 'Restored account 0' })
    accountTile.getByText("tz1UN...oBUB3")
  })
});
