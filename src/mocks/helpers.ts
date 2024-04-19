import BigNumber from "bignumber.js";

import { ImplicitAccount, MnemonicAccount } from "../types/Account";
import { RawPkh } from "../types/Address";
import { accountsSlice } from "../utils/redux/slices/accountsSlice";
import { store } from "../utils/redux/store";
import { estimate } from "../utils/tezos";

export const dispatchMockAccounts = (accounts: MnemonicAccount[]) => {
  store.dispatch(accountsSlice.actions.addMockMnemonicAccounts(accounts));
};

export const mockEstimatedFee = (fee: number | string | BigNumber) =>
  jest.mocked(estimate).mockResolvedValueOnce(BigNumber(fee));

export const addAccount = (account: ImplicitAccount) => {
  if (account.type === "mnemonic") {
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));
  } else {
    store.dispatch(accountsSlice.actions.addAccount(account));
  }
};

export const fakeAddressExists = (revealedKeyPairs: { pkh: RawPkh }[]) => (pkh: RawPkh) =>
  Promise.resolve(revealedKeyPairs.map(keyPair => keyPair.pkh).includes(pkh));
