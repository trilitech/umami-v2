import { Account } from "../types/Account";
import { RawPkh } from "../types/Address";
import { Multisig } from "../utils/multisig/types";
import { accountsActions } from "../utils/redux/slices/accountsSlice/accountsSlice";
import { multisigActions } from "../utils/redux/slices/multisigsSlice";
import { store } from "../utils/redux/store";

export const addAccount = (account: Account | Multisig) => {
  if (!("type" in account) || account.type === "multisig") {
    store.dispatch(multisigActions.mockAddAccount(account));
    return;
  }

  store.dispatch(accountsActions.addAccount(account));
};

export const fakeAddressExists = (revealedKeyPairs: { pkh: RawPkh }[]) => (pkh: RawPkh) =>
  Promise.resolve(revealedKeyPairs.map(keyPair => keyPair.pkh).includes(pkh));
