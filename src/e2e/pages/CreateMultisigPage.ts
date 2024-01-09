import { Locator, Page } from "@playwright/test";

const SIGNER_LABEL_REGEXP = /\d+ signer$/;

export class CreateMultisigPage {
  constructor(readonly page: Page) {}

  signerInputs(): Locator {
    return this.page.getByText(SIGNER_LABEL_REGEXP);
  }

  async addSigner(): Promise<void> {
    await this.page.getByRole("button", { name: "+ Add Signer" }).click();
  }

  async setSigner(index: number, signer: string): Promise<void> {
    while (index + 1 > (await this.signerInputs().count())) {
      await this.addSigner();
    }
    await this.signerInputs().nth(index).fill(signer);
  }
}
