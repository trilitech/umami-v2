import { Locator, Page } from "@playwright/test";

const APPROVER_LABEL_REGEXP = /\d+\w\w approver$/;

export class CreateMultisigPage {
  constructor(readonly page: Page) {}

  approverInputs(): Locator {
    return this.page.getByText(APPROVER_LABEL_REGEXP);
  }

  async addApprover(): Promise<void> {
    await this.page.getByRole("button", { name: "+ Add Approver" }).click();
  }

  async setApprover(index: number, approver: string): Promise<void> {
    while (index + 1 > (await this.approverInputs().count())) {
      await this.addApprover();
    }
    await this.approverInputs().nth(index).fill(approver);
  }
}
