import { Page, expect, test } from "@playwright/test";

import {
  AVAILABLE_DERIVATION_PATHS,
  defaultDerivationPathPattern,
} from "../../utils/account/derivationPathUtils";
import { formatPkh } from "../../utils/format";
import { derivePublicKeyPair } from "../../utils/mnemonic";
import { getFingerPrint } from "../../utils/tezos/helpers";
import { MASTER_PASSWORD, cleanupState } from "../utils";

cleanupState();

const onboardWithNewMnemonic = async ({
  page,
  derivationPath,
}: {
  page: Page;
  derivationPath?: string;
}) => {
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
  if (derivationPath) {
    await page.getByTestId("select-input").click();
    await page.getByText(derivationPath).click();
  }
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByTestId("password").fill(MASTER_PASSWORD);
  page.getByLabel("Confirm Password").fill(MASTER_PASSWORD);

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("/#/home");

  return words.join(" ");
};

test.describe("Create Mnemonic adds new group with one account", () => {
  test("With default derivation path", async ({ page }) => {
    const seedphrase = await onboardWithNewMnemonic({ page });
    const expectedFingerprint = await getFingerPrint(seedphrase);
    const expectedPkh = (await derivePublicKeyPair(seedphrase, `m/${defaultDerivationPathPattern}`))
      .pkh;

    // Created mnemonic group
    await expect(page.getByTestId(`account-group-Seedphrase ${expectedFingerprint}`)).toBeVisible();
    await expect(page.getByText(`Seedphrase ${expectedFingerprint}`)).toBeVisible();
    expect((await page.getByTestId(/account-tile/).all()).length).toBe(1);

    // Created mnemonic account
    const accountTile = page.getByTestId(`account-tile-${expectedPkh}`);
    await expect(accountTile).toBeVisible();
    await expect(accountTile.getByRole("heading", { name: "Account" })).toBeVisible();
    await expect(accountTile.getByText(formatPkh(expectedPkh))).toBeVisible();
  });

  test("With custom derivation path", async ({ page }) => {
    const derivationPath = AVAILABLE_DERIVATION_PATHS[2].value;
    const seedphrase = await onboardWithNewMnemonic({ page, derivationPath });
    const expectedFingerprint = await getFingerPrint(seedphrase);
    const expectedPkh = (await derivePublicKeyPair(seedphrase, `m/${derivationPath}`)).pkh;

    // Created mnemonic group
    await expect(page.getByTestId(`account-group-Seedphrase ${expectedFingerprint}`)).toBeVisible();
    await expect(page.getByText(`Seedphrase ${expectedFingerprint}`)).toBeVisible();
    expect((await page.getByTestId(/account-tile/).all()).length).toBe(1);

    // Created mnemonic account
    const accountTile = page.getByTestId(`account-tile-${expectedPkh}`);
    await expect(accountTile).toBeVisible();
    await expect(accountTile.getByRole("heading", { name: "Account" })).toBeVisible();
    await expect(accountTile.getByText(formatPkh(expectedPkh))).toBeVisible();
  });
});
