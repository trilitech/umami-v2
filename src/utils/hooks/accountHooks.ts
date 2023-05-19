import { decrypt } from "../aes";
import accountsSlice from "../store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { restoreFromMnemonic } from "../store/thunks/restoreMnemonicAccounts";
import { restoreAccountsFromLedger } from "../store/thunks/restoreAccountsFromLedger";
import { restoreAccountsFromSocial } from "../store/thunks/restoreAccountsFromSocial";
import { useGetAccountBalance } from "./assetsHooks";

export const useAccounts = () => {
  return useAppSelector((s) => s.accounts.items);
};

export const useGetAccount = () => {
  const accounts = useAccounts();
  return (pkh: string) => accounts.find((a) => a.pkh === pkh);
};

export const useSelectedAccount = () => {
  const pkh = useAppSelector((s) => s.accounts.selected);
  const accounts = useAppSelector((s) => s.accounts.items);

  return pkh === null ? null : accounts.find((a) => a.pkh === pkh);
};

export const useSelectedAccountBalance = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();

  return account && accountBalance(account.pkh);
};

export const useReset = () => {
  const dispatch = useAppDispatch();

  return () => {
    dispatch(accountsSlice.actions.reset());
  };
};

export const useGetOwnedAccount = () => {
  const accounts = useAccounts();
  return (pkh: string) => {
    const account = accounts.find((a) => a.pkh === pkh);
    if (!account) {
      throw new Error(`You do not ownn account:${pkh}`);
    }
    return account;
  };
};

export const useRestoreSecret = () => {
  const dispatch = useAppDispatch();

  return (seedPhrase: string, password: string, label?: string, derivationPathPattern?: string) => {
    return dispatch(restoreFromMnemonic({ seedPhrase, password, label, derivationPathPattern }));
  };
};

export const useRestoreLedger = () => {
  const dispatch = useAppDispatch();

  return (derivationPath: string, pk: string, pkh: string, label: string) =>
    dispatch(restoreAccountsFromLedger(derivationPath, pk, pkh, label));
};

export const useRestoreSocial = () => {
  const dispatch = useAppDispatch();

  return (pk: string, pkh: string, label: string) =>
    dispatch(restoreAccountsFromSocial(pk, pkh, label));
};

/**
 * returns null if no password has been set
 */
export const useCheckPasswordValidity = () => {
  const seedPhrases = useAppSelector((s) => s.accounts.seedPhrases);

  const existingSeedPhrase = Object.values(seedPhrases)[0];
  if (!existingSeedPhrase) {
    return null;
  }

  return async (password: string) => {
    await decrypt(existingSeedPhrase, password);
  };
};
