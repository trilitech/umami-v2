import { AccountType, LedgerAccount, SocialAccount } from "../../types/Account";
import { useAppDispatch } from "../redux/hooks";
import accountsSlice from "../redux/slices/accountsSlice";
import { restoreFromMnemonic } from "../redux/thunks/restoreMnemonicAccounts";
import { restore as restoreFromSecretKey } from "../redux/thunks/secretKeyAccount";

const { addAccount, removeMnemonicAndAccounts, removeNonMnemonicAccounts } = accountsSlice.actions;

export const useReset = () => {
  return () => {
    localStorage.clear();

    window.location.reload();
  };
};

export const useRestoreFromMnemonic = () => {
  const dispatch = useAppDispatch();

  return (
    mnemonic: string,
    password: string,
    groupLabel: string,
    derivationPathPattern?: string
  ) => {
    return dispatch(
      restoreFromMnemonic({
        mnemonic,
        password,
        groupLabel,
        derivationPathPattern,
      })
    ).unwrap();
  };
};

export const useRestoreFromSecretKey = () => {
  const dispatch = useAppDispatch();

  return (secretKey: string, password: string, label: string) =>
    dispatch(
      restoreFromSecretKey({
        secretKey,
        password,
        label,
      })
    );
};

export const useRestoreLedger = () => {
  const dispatch = useAppDispatch();
  return (derivationPath: string, pk: string, pkh: string, label: string) => {
    const account: LedgerAccount = {
      derivationPath,
      curve: "ed25519",
      type: "ledger",
      pk: pk,
      address: { type: "implicit", pkh },
      label,
    };
    dispatch(addAccount(account));
  };
};

export const useRestoreSocial = () => {
  const dispatch = useAppDispatch();
  return (pk: string, pkh: string, label: string) => {
    const account: SocialAccount = {
      type: "social",
      pk: pk,
      address: { type: "implicit", pkh },
      idp: "google",
      label,
    };
    dispatch(addAccount(account));
  };
};

export const useRemoveMnemonic = () => {
  const dispatch = useAppDispatch();
  return (fingerPrint: string) => {
    dispatch(
      removeMnemonicAndAccounts({
        fingerPrint,
      })
    );
  };
};
export const useRemoveNonMnemonic = () => {
  const dispatch = useAppDispatch();
  return (accountType: AccountType) => {
    dispatch(
      removeNonMnemonicAccounts({
        accountType,
      })
    );
  };
};
