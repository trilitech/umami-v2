import { AccountType, LedgerAccount, SecretKeyAccount, SocialAccount } from "../../types/Account";
import { useAppDispatch } from "../redux/hooks";
import { accountsSlice } from "../redux/slices/accountsSlice";

const { removeMnemonicAndAccounts, removeNonMnemonicAccounts } = accountsSlice.actions;

/**
 * Hook for removing all accounts from mnemonic group by a given fingerprint.
 */
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

/**
 * Hook for removing all accounts of a given type.
 */
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

/**
 * Hook for removing single account.
 */
export const useRemoveAccount = () => {
  const dispatch = useAppDispatch();

  return (account: SocialAccount | LedgerAccount | SecretKeyAccount) => {
    dispatch(accountsSlice.actions.removeAccount(account));
  };
};
