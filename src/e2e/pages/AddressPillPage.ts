import { Locator } from "@playwright/test";

export class AddressPillPage {
  constructor(readonly element: Locator) {}

  async getAddress(): Promise<string | null> {
    return await this.element.getByTestId("address-pill-raw-address").textContent();
  }
}
