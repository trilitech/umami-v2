import { type Account } from "@umami/core";
import { type Multisig } from "@umami/multisig";

import { accountsActions, multisigActions } from "./slices";
import { store } from "./store";

export const addTestAccount = (account: Account | Multisig) => {
  if (!("type" in account) || account.type === "multisig") {
    store.dispatch(multisigActions.mockAddAccount(account));
    return;
  }

  store.dispatch(accountsActions.addAccount(account));
};
