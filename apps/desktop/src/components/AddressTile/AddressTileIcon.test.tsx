import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/core";
import type { IDP } from "@umami/social-auth";
import { addTestAccount } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { AddressTileIcon } from "./AddressTileIcon";
import { type AddressKind } from "./types";
import { render, screen } from "../../mocks/testUtils";

const fixture = (addressKind: AddressKind) => (
  <AddressTileIcon addressKind={addressKind} size="sm" />
);

describe("<AddressTileIcon />", () => {
  const label = "some label";

  it.each([mockMnemonicAccount(0), mockSecretKeyAccount(0)])("displays the $type icon", account => {
    addTestAccount(account);
    render(fixture({ ...account, pkh: account.address.pkh }));
    expect(screen.getByTestId("identicon")).toBeVisible();
  });

  it.each([
    "google" as const,
    "facebook" as const,
    "twitter" as const,
    "reddit" as const,
    "email" as const,
  ])("displays the %s social icon", (idp: IDP) => {
    const account = mockSocialAccount(0, "account label", idp);
    addTestAccount(account);

    render(fixture({ ...account.address, type: "social", label }));

    expect(screen.getByTestId(`${idp}-icon`)).toBeVisible();
  });

  it("displays the ledger icon", () => {
    const account = mockLedgerAccount(0);
    addTestAccount(account);

    render(fixture({ ...account.address, type: "ledger", label }));

    expect(screen.getByTestId("ledger-icon")).toBeVisible();
  });

  it("displays the multisig icon", () => {
    const account = mockMultisigAccount(0);
    addTestAccount(account);

    render(fixture({ ...account.address, type: "multisig", label }));

    expect(screen.getByTestId("key-icon")).toBeVisible();
  });

  it("displays the baker icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "baker", label }));
    expect(screen.getByTestId("baker-icon")).toBeVisible();
  });

  it("displays the contact icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "contact", label }));
    expect(screen.getByTestId("contact-icon")).toBeVisible();
  });

  it("displays the unknown icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "unknown", label: null }));
    expect(screen.getByTestId("unknown-contact-icon")).toBeVisible();
  });
});
