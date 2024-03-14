import { useGetAccountsByFingerPrint, useGetAccountsByType } from "./getAccountDataHooks";
import {
  Account,
  AccountType,
  LedgerAccount,
  SecretKeyAccount,
  SocialAccount,
} from "../../types/Account";
import { useAppDispatch } from "../redux/hooks";
import { accountsSlice } from "../redux/slices/accountsSlice";
import { batchesSlice } from "../redux/slices/batches";

const { removeMnemonicAndAccounts, removeNonMnemonicAccounts } = accountsSlice.actions;

/**
 * Hook for removing all accounts from mnemonic group by a given fingerprint.
 */
export const useRemoveMnemonic = () => {
  const dispatch = useAppDispatch();
  const getAccountsByFingerPrint = useGetAccountsByFingerPrint();
  const removeAccountsDependencies = useRemoveAccountsDependencies();

  return (fingerPrint: string) => {
    removeAccountsDependencies(getAccountsByFingerPrint(fingerPrint));

    dispatch(
      removeMnemonicAndAccounts({
        fingerPrint,
      })
    );
  };
};

/**
 * Hook for removing all accounts of a given type.
 */
export const useRemoveNonMnemonic = () => {
  const dispatch = useAppDispatch();
  const getAccountsByType = useGetAccountsByType();
  const removeAccountsDependencies = useRemoveAccountsDependencies();

  return (accountType: AccountType) => {
    removeAccountsDependencies(getAccountsByType(accountType));

    dispatch(
      removeNonMnemonicAccounts({
        accountType,
      })
    );
  };
};

/**
 * Hook for removing single account.
 */
export const useRemoveAccount = () => {
  const dispatch = useAppDispatch();
  const removeAccountsDependencies = useRemoveAccountsDependencies();

  return (account: SocialAccount | LedgerAccount | SecretKeyAccount) => {
    removeAccountsDependencies([account]);
    dispatch(accountsSlice.actions.removeAccount(account));
  };
};

/**
 * Hook for removing all stored accounts' dependencies.
 */
const useRemoveAccountsDependencies = () => {
  const dispatch = useAppDispatch();

  return (accounts: Account[]) => {
    const pkhs = accounts.map(account => account.address.pkh);
    dispatch(batchesSlice.actions.removeByAccounts({ pkhs }));
  };
};
