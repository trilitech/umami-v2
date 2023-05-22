import { decrypt } from "../aes";
import accountsSlice from "../store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { restoreFromMnemonic } from "../store/thunks/restoreMnemonicAccounts";
import { useGetAccountBalance } from "./assetsHooks";
import { SocialAccount, AccountType, LedgerAccount } from "../../types/Account";
import { useNavigate } from "react-router-dom";

const { add, removeSecret } = accountsSlice.actions;

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

  const navigate = useNavigate();
  return () => {
    dispatch(accountsSlice.actions.reset());

    // When accounts are empty
    // route SHOULD reinitialize automatically to /welcome (see Router.tsx line 93)
    //
    // But sometimes it keeps the old route:
    // displays welcome screen with /#/settings in url (which should be impossible...)
    //
    // Is it a bug related to hashrouter?
    // In the meantime we just redirect

    navigate("/welcome");
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

  return (
    seedPhrase: string,
    password: string,
    label?: string,
    derivationPathPattern?: string
  ) => {
    return dispatch(
      restoreFromMnemonic({
        seedPhrase,
        password,
        label,
        derivationPathPattern,
      })
    ).unwrap();
  };
};

export const useRestoreLedger = () => {
  const dispatch = useAppDispatch();
  return (derivationPath: string, pk: string, pkh: string, label: string) => {
    const account: LedgerAccount = {
      derivationPath,
      curve: "ed25519",
      type: AccountType.LEDGER,
      pk: pk,
      pkh: pkh,
      label,
    };
    dispatch(add([account]));
  };
};

export const useRestoreSocial = () => {
  const dispatch = useAppDispatch();
  return (pk: string, pkh: string, label: string) => {
    const account: SocialAccount = {
      type: AccountType.SOCIAL,
      pk: pk,
      pkh: pkh,
      idp: "google",
      label,
    };
    dispatch(add([account]));
  };
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

export const useRemoveMnemonic = () => {
  const dispatch = useAppDispatch();
  return (fingerPrint: string) => {
    dispatch(
      removeSecret({
        fingerPrint,
      })
    );
  };
};
