import {
  type ImplicitAccount,
  mockImplicitAccount,
  mockSocialAccount,
  rawAccountFixture,
} from "@umami/core";
import { type IDP } from "@umami/social-auth";
import { type UmamiStore, addTestAccount, assetsActions } from "@umami/state";

export const mockAccountTypes = [
  "mnemonic",
  "ledger",
  "secret_key",
  "social_google",
  "social_facebook",
  "social_twitter",
  "social_reddit",
  "social_email",
] as const;
export type MockAccountType = (typeof mockAccountTypes)[number];

export const mockAccount = ({
  label,
  balance,
  store,
  accountType,
}: {
  label: string;
  store: UmamiStore;
  balance: number;
  accountType: MockAccountType;
}): ImplicitAccount => {
  let account: ImplicitAccount;

  if (accountType.includes("social")) {
    const [_, idp] = accountType.split("_");
    account = mockSocialAccount(0, label, idp as IDP);
  } else {
    account = mockImplicitAccount(0, accountType as ImplicitAccount["type"], "", label);
  }

  addTestAccount(store, account);

  if (balance > -1) {
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({
          address: account.address.pkh,
          balance,
        }),
      ])
    );
  }
  return account;
};
