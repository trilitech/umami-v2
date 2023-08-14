import { maxBy } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  AccountType,
  Account,
  LedgerAccount,
  MultisigAccount,
  SocialAccount,
  ImplicitAccount,
} from "../../types/Account";
import { RawPkh } from "../../types/Address";
import { decrypt } from "../crypto/AES";
import { multisigToAccount } from "../multisig/helpers";
import { Multisig } from "../multisig/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import accountsSlice from "../redux/slices/accountsSlice";
import { restoreFromMnemonic } from "../redux/thunks/restoreMnemonicAccounts";
import { useGetAccountBalance } from "./assetsHooks";
import { useMultisigs } from "./multisigHooks";

const { addAccount, removeMnemonicAndAccounts } = accountsSlice.actions;

export const useImplicitAccounts = () => {
  return useAppSelector(s => s.accounts.items);
};

export const useGetImplicitAccountSafe = () => {
  const accounts = useImplicitAccounts();
  return (pkh: RawPkh) => accounts.find(account => account.address.pkh === pkh);
};

// For cleaner code and ease of use this hook returns an ImplicitAccount
// Please make sure not to pass in non existing Pkh
export const useGetImplicitAccount = () => {
  const getAccount = useGetImplicitAccountSafe();
  return (pkh: RawPkh) => getAccount(pkh) as ImplicitAccount;
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

export const useGetOwnedAccountSafe = () => {
  const accounts = useAllAccounts();
  return (pkh: string): Account | undefined => accounts.find(a => a.address.pkh === pkh);
};

export const useGetOwnedAccount = () => {
  const getOwnedAccount = useGetOwnedAccountSafe();
  return (pkh: string): Account => {
    const account = getOwnedAccount(pkh);
    if (!account) {
      throw new Error(`You do not own account:${pkh}`);
    }
    return account;
  };
};

export const useRestoreSecret = () => {
  const dispatch = useAppDispatch();

  return (seedPhrase: string, password: string, label?: string, derivationPathPattern?: string) => {
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
      address: { type: "implicit", pkh },
      label,
    };
    dispatch(addAccount([account]));
  };
};

export const useRestoreSocial = () => {
  const dispatch = useAppDispatch();
  return (pk: string, pkh: string, label: string) => {
    const account: SocialAccount = {
      type: AccountType.SOCIAL,
      pk: pk,
      address: { type: "implicit", pkh },
      idp: "google",
      label,
    };
    dispatch(addAccount([account]));
  };
};

/**
 * returns null if no password has been set
 */
export const useCheckPasswordValidity = () => {
  const seedPhrases = useAppSelector(s => s.accounts.seedPhrases);

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
      removeMnemonicAndAccounts({
        fingerPrint,
      })
    );
  };
};

export const useMultisigAccounts = (): MultisigAccount[] => {
  const multisigs: Multisig[] = useMultisigs();

  // TODO: use names from the store and only fallback to the random index
  return multisigs.map((m, i) => multisigToAccount(m, `Multisig Account ${i}`));
};

// For cleaner code and ease of use this hook returns a MultisigAccount
// Please make sure not to pass in non existing Pkh
export const useGetMultisigAccount = () => {
  const accounts = useMultisigAccounts();
  return (pkh: RawPkh) => accounts.find(account => account.address.pkh === pkh) as MultisigAccount;
};

export const useAllAccounts = (): Account[] => {
  const implicit = useImplicitAccounts();
  const multisig = useMultisigAccounts();
  return [...implicit, ...multisig];
};

export const useFirstAccount = (): Account => {
  const accounts = useImplicitAccounts();
  return accounts[0];
};

export const useAccountIsMultisig = () => {
  const accounts = useMultisigAccounts();
  return (pkh: string) => {
    return !!accounts.find(account => account.address.pkh === pkh);
  };
};

export const useGetMultisigSigners = () => {
  const implicitAccounts = useImplicitAccounts();
  return (multisigAccount: MultisigAccount) => {
    const signers = implicitAccounts.filter(implicitAccount =>
      multisigAccount.signers.some(signer => signer.pkh === implicitAccount.address.pkh)
    );

    if (signers.length === 0) {
      console.warn(
        "Wallet doesn't own any signers for multisig contract " + multisigAccount.address.pkh
      );
    }
    return signers;
  };
};

export const useGetOwnedSignersForAccount = () => {
  const getMultisigSigners = useGetMultisigSigners();

  return (account: Account) => {
    switch (account.type) {
      case AccountType.LEDGER:
      case AccountType.MNEMONIC:
      case AccountType.SOCIAL:
        return [account];
      case AccountType.MULTISIG:
        return getMultisigSigners(account);
    }
  };
};

// The best signer is the one with the most tez
// For implicit accounts it will be the account itself
// For multisig accounts it will be the associated implicit signer with the most tez
export const useGetBestSignerForAccount = () => {
  const getSigners = useGetOwnedSignersForAccount();
  const accountBalance = useGetAccountBalance();

  return (account: Account) =>
    maxBy(
      getSigners(account),
      signer => accountBalance(signer.address.pkh) || "0"
    ) as ImplicitAccount;
};
