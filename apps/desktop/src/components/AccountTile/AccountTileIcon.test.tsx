import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSocialAccount,
} from "@umami/core";
import { type IDP } from "@umami/social-auth";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";

import { AccountTileIcon } from "./AccountTileIcon";
import { render, screen } from "../../mocks/testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AccountTileIcon />", () => {
  it.each(["mnemonic", "secret_key"])("displays the %s icon", () => {
    render(<AccountTileIcon account={mockMnemonicAccount(0)} size="sm" />, { store });
    expect(screen.getByTestId("identicon")).toBeVisible();
  });

  it.each([
    "google" as const,
    "facebook" as const,
    "twitter" as const,
    "reddit" as const,
    "email" as const,
  ])("displays the %s social icon", (idp: IDP) => {
    render(<AccountTileIcon account={mockSocialAccount(0, "account label", idp)} size="sm" />, {
      store,
    });
    expect(screen.getByTestId(`${idp}-icon`)).toBeVisible();
  });

  it("displays the ledger icon", () => {
    const account = mockLedgerAccount(0);
    addTestAccount(store, account);

    render(<AccountTileIcon account={account} size="sm" />, { store });

    expect(screen.getByTestId("ledger-icon")).toBeVisible();
  });

  it("displays the multisig icon", () => {
    const account = mockMultisigAccount(0);
    addTestAccount(store, account);

    render(<AccountTileIcon account={account} size="sm" />, { store });

    expect(screen.getByTestId("key-icon")).toBeVisible();
  });
});
