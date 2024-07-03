import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/core";
import type { IDP } from "@umami/social-auth";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { AddressTileIcon } from "./AddressTileIcon";
import { render, screen } from "../../mocks/testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AddressTileIcon />", () => {
  const label = "some label";

  it.each([mockMnemonicAccount(0), mockSecretKeyAccount(0)])("displays the $type icon", account => {
    addTestAccount(store, account);
    render(<AddressTileIcon addressKind={{ ...account, pkh: account.address.pkh }} size="sm" />, {
      store,
    });
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
    addTestAccount(store, account);

    render(
      <AddressTileIcon addressKind={{ ...account.address, type: "social", label }} size="sm" />,
      { store }
    );

    expect(screen.getByTestId(`${idp}-icon`)).toBeVisible();
  });

  it("displays the ledger icon", () => {
    const account = mockLedgerAccount(0);
    addTestAccount(store, account);

    render(
      <AddressTileIcon addressKind={{ ...account.address, type: "ledger", label }} size="sm" />,
      { store }
    );

    expect(screen.getByTestId("ledger-icon")).toBeVisible();
  });

  it("displays the multisig icon", () => {
    const account = mockMultisigAccount(0);
    addTestAccount(store, account);

    render(
      <AddressTileIcon addressKind={{ ...account.address, type: "multisig", label }} size="sm" />,
      { store }
    );

    expect(screen.getByTestId("key-icon")).toBeVisible();
  });

  it("displays the baker icon", () => {
    render(
      <AddressTileIcon
        addressKind={{ ...mockImplicitAddress(0), type: "baker", label }}
        size="sm"
      />,
      { store }
    );
    expect(screen.getByTestId("baker-icon")).toBeVisible();
  });

  it("displays the contact icon", () => {
    render(
      <AddressTileIcon
        addressKind={{ ...mockImplicitAddress(0), type: "contact", label }}
        size="sm"
      />,
      { store }
    );
    expect(screen.getByTestId("contact-icon")).toBeVisible();
  });

  it("displays the unknown icon", () => {
    render(
      <AddressTileIcon
        addressKind={{ ...mockImplicitAddress(0), type: "unknown", label: null }}
        size="sm"
      />,
      { store }
    );
    expect(screen.getByTestId("unknown-contact-icon")).toBeVisible();
  });
});
