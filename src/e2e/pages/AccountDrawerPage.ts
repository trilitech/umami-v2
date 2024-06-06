import { Locator, Page, expect } from "@playwright/test";

import { AddressPillPage } from "./AddressPillPage";
import { SignPage } from "./SignPage";
import { RawPkh } from "../../types/Address";
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

  async getBakerAddress(): Promise<RawPkh> {
    await this.openTab("Earn");
    return (await new AddressPillPage(this.getBakerLocator()).getAddress()) as string;
  }

  getBakerLocator(): Locator {
    return this.page.getByTestId("current-baker");
  }

  async isDelegating(): Promise<boolean> {
    await this.openTab("Earn");
    const delegationStatus = this.page.getByTestId("delegation-status");
    return (await delegationStatus.getByText("Inactive").count()) === 0;
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
}
