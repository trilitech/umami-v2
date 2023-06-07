import { useNavigate } from "react-router-dom";
import {
  AccountType,
  AllAccount,
  LedgerAccount,
  MultisigAccount,
  SocialAccount,
} from "../../types/Account";
import { decrypt } from "../aes";
import { MultisigWithOperations } from "../multisig/types";
import accountsSlice from "../store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { restoreFromMnemonic } from "../store/thunks/restoreMnemonicAccounts";

const { add, removeSecret } = accountsSlice.actions;

export const useImplicitAccounts = () => {
  return useAppSelector((s) => s.accounts.items);
};

export const useGetImplicitAccount = () => {
  const accounts = useImplicitAccounts();
  return (pkh: string) => accounts.find((a) => a.pkh === pkh);
};

export const useReset = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  return () => {
    dispatch(accountsSlice.actions.reset());

    // When accounts are empty
    // route SHOULD reinitialize automatically to /welcome:
    // https://github.com/trilitech/umami-v2/blob/0d36240e245d81cc1eed89037e005d6ca3542e51/src/Router.tsx#L92
    //
    // But sometimes it keeps the old route:
    // displays welcome screen with /#/settings in url (which should be impossible...)
    //
    // Might be a bug related to hashrouter
    // In the meantime we just redirect

    navigate("/welcome");
  };
};

export const useGetOwnedAccount = () => {
  const accounts = useImplicitAccounts();
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

export const useMultisigAccounts = (): MultisigAccount[] => {
  const multisigs: MultisigWithOperations[] = useAppSelector(
    (s) => s.multisigs.items
  );

  return multisigs.map((m, i) => ({
    label: `Multisig Account ${i}`,
    pkh: m.address,
    operations: m.operations,
    type: AccountType.MULTISIG,
  }));
};

export const useAllAccounts = (): AllAccount[] => {
  const implicit = useImplicitAccounts();
  const multisig = useMultisigAccounts();
  return [...implicit, ...multisig];
};
