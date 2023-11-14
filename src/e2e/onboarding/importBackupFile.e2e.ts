import { test, expect, Page } from "@playwright/test";
import path from "path";

const fileAndPassword = [
  ["V1Backup.json", "asdfasdf"],
  ["V2Backup.json", "123123123"],
];

for (const [backupFile, password] of fileAndPassword) {
  test(`Imports ${backupFile}`, async ({ page }) => {
    await importBackupFile(page, backupFile, password);
  });
}

const importBackupFile = async (page: Page, backupFile: string, password: string) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Get started" }).click();

  expect(page.getByRole("heading", { name: "Accept to Continue" })).toBeVisible();
  await page.getByText(/I confirm/).click();

  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I already have a wallet" }).click();

  await page.getByRole("button", { name: "Restore from Backup" }).click();

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByTestId("file-input").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, `backups/${backupFile}`));

  await page.getByTestId("password-input").fill(password);

  await page.getByRole("button", { name: "Import Wallet" }).click();
  await page.waitForURL("/#/home");
};
