import { test, expect } from "@playwright/test";
import { MASTER_PASSWORD, cleanupState } from "../utils";
import { derivePublicKeyPair } from "../../utils/mnemonic";
import { getFingerPrint } from "../../utils/tezos/helpers";

cleanupState();

test.describe("Create Mnemonic", () => {
  test("Adds new group with one account", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Get started" }).click();

    expect(page.getByRole("heading", { name: "Accept to Continue" })).toBeVisible();
    await page.getByText(/I confirm/).click();

    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Create a new Account" }).click();
    await page.getByRole("button", { name: "I understand" }).click();

    const words: string[] = [];
    for (let i = 0; i < 24; i++) {
      words.push(await page.getByTestId(`mnemonic-word-${i}`).innerText());
    }
    await page.getByRole("button", { name: "OK, I've recorded it" }).click();

    for (let i = 0; i < 5; i++) {
      const wordIndex = Number(await page.getByTestId("mnemonic-index").nth(i).innerText()) - 1;
      await page.getByRole("textbox").nth(i).fill(words[wordIndex]);
    }
    await page.getByRole("button", { name: "Continue" }).click();

    expect(page.getByRole("heading", { name: "Name Your Account" })).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();

    expect(page.getByRole("heading", { name: "Derivation Path" })).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByTestId("password").fill(MASTER_PASSWORD);
    page.getByLabel("Confirm Password").fill(MASTER_PASSWORD);

    await page.getByRole("button", { name: "Submit" }).click();

    await page.waitForURL("/#/home");

    // Created mnemonic group
    const expectedFingerprint = await getFingerPrint(words.join(" "));
    await expect(page.getByTestId(`account-group-Seedphrase ${expectedFingerprint}`)).toBeVisible();
    await expect(page.getByText(`Seedphrase ${expectedFingerprint}`)).toBeVisible();
    expect((await page.getByTestId(/account-tile/).all()).length).toBe(1);

    // Created mnemonic account
    const expectedPkh = (await derivePublicKeyPair(words.join(" "), "m/44'/1729'/0'/0'")).pkh;
    const displayedPkh = expectedPkh.slice(0, 5) + "..." + expectedPkh.slice(-5);
    const accountTile = page.getByTestId(`account-tile-${expectedPkh}`);
    await expect(accountTile).toBeVisible();
    await expect(accountTile.getByRole("heading", { name: "Account" })).toBeVisible();
    await expect(accountTile.getByText(displayedPkh)).toBeVisible();
  });
});
