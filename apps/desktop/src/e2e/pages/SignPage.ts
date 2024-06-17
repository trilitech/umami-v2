import { type Locator, type Page } from "@playwright/test";

export class SignPage {
  constructor(
    readonly page: Page,
    readonly password?: string
  ) {}

  getSignButton(): Locator {
    return this.page.getByRole("button", {
      name: /^(Confirm|Propose|Submit) (Transaction|Batch|Contract)$/,
    });
  }

  async sign(): Promise<void> {
    if (this.password) {
      await this.page.getByLabel("Password", { exact: true }).fill(this.password);
    }
    await this.getSignButton().click();
  }
}
