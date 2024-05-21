import { AccountTileIcon } from "./AccountTileIcon";
import { IDP } from "../../auth";
import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { render, screen } from "../../mocks/testUtils";
import { Account } from "../../types/Account";

const fixture = (account: Account) => <AccountTileIcon account={account} />;

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
    addAccount(account);

    render(fixture(account));

    expect(screen.getByTestId("ledger-icon")).toBeVisible();
  });

  it("displays the multisig icon", () => {
    const account = mockMultisigAccount(0);
    addAccount(account);

    render(fixture(account));

    expect(screen.getByTestId("key-icon")).toBeVisible();
  });
});
