import { Locator, Page, expect } from "@playwright/test";

import { SignPage } from "./SignPage";
import { TEZ } from "../../utils/tezos";
import { DEFAULT_ACCOUNTS } from "../constants";

export class AccountDrawerPage {
  constructor(readonly page: Page) {}

  async openTab(tabName: string): Promise<void> {
    await this.page.getByTestId(`account-card-${tabName.toLowerCase()}-tab`).click();
  }

  async delegateTo(baker: string): Promise<void> {
    await this.getRoundButton("Delegate").click();
    await expect(this.page.getByRole("heading", { name: "Delegation", exact: true })).toBeVisible();

    await this.page.getByRole("button", { name: "Continue" }).click();

    const bakerAddress = DEFAULT_ACCOUNTS[baker].pkh;
    await this.page.getByLabel("Baker").fill(bakerAddress);

    await this.page.getByRole("button", { name: "Preview" }).click();

    await new SignPage(this.page, "12345678").sign();
  }

  getRoundButton(buttonName: string): Locator {
    return this.page.getByTestId("account-drawer-cta-button").filter({ hasText: buttonName });
  }

  get baker(): Locator {
    return this.page.getByTestId("current-baker");
  }

  get delegationStatus(): Locator {
    return this.page.getByTestId("delegation-status");
  }

  async undelegate(): Promise<void> {
    await this.openTab("Earn");
    await this.page.getByTestId("end-delegation-button").click();
    await expect(
      this.page.getByRole("heading", { name: "End Delegation", exact: true })
    ).toBeVisible();

    await this.page.getByRole("button", { name: "Preview" }).click();

    await new SignPage(this.page, "12345678").sign();
  }

  async stake(amount: number): Promise<void> {
    await this.openTab("Earn");
    await this.page.getByRole("button", { name: "Stake", exact: true }).click();

    await expect(this.page.getByRole("heading", { name: "Disclaimer", exact: true })).toBeVisible();
    await this.page.getByText(/I understand/).click();
    await this.page.getByRole("button", { name: "Continue" }).click();

    await this.page.getByLabel("Enter Amount").fill(String(amount));
    await this.page.getByRole("button", { name: "Preview" }).click();
    await new SignPage(this.page, "12345678").sign();
  }

  async stakedBalance(): Promise<number> {
    await this.openTab("Earn");
    const balance = await this.page
      .getByTestId("staked-balance")
      .locator("div")
      .filter({ hasText: TEZ })
      .textContent();
    return parseFloat(String(balance));
  }
}
