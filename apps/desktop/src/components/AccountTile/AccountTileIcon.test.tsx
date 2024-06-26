import {
  type Account,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSocialAccount,
} from "@umami/core";
import { type IDP } from "@umami/social-auth";
import { addTestAccount } from "@umami/state";

import { AccountTileIcon } from "./AccountTileIcon";
import { render, screen } from "../../mocks/testUtils";

const fixture = (account: Account) => <AccountTileIcon account={account} size="sm" />;

describe("<AccountTileIcon />", () => {
  it.each(["mnemonic", "secret_key"])("displays the %s icon", () => {
    render(fixture(mockMnemonicAccount(0)));
    expect(screen.getByTestId("identicon")).toBeVisible();
  });

  it.each([
    "google" as const,
    "facebook" as const,
    "twitter" as const,
    "reddit" as const,
    "email" as const,
  ])("displays the %s social icon", (idp: IDP) => {
    render(fixture(mockSocialAccount(0, "account label", idp)));
    expect(screen.getByTestId(`${idp}-icon`)).toBeVisible();
  });

  it("displays the ledger icon", () => {
    const account = mockLedgerAccount(0);
    addTestAccount(account);

    render(fixture(account));

    expect(screen.getByTestId("ledger-icon")).toBeVisible();
  });

  it("displays the multisig icon", () => {
    const account = mockMultisigAccount(0);
    addTestAccount(account);

    render(fixture(account));

    expect(screen.getByTestId("key-icon")).toBeVisible();
  });
});
