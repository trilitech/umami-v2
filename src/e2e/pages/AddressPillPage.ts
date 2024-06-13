import { type Locator } from "@playwright/test";

export class AddressPillPage {
  constructor(readonly element: Locator) {}

  get address(): Locator {
    return this.element.getByTestId("address-pill-raw-address");
  }
}
