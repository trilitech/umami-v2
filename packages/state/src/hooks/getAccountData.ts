import {
  type Account,
  type ImplicitAccount,
  type MnemonicAccount,
  type MultisigAccount,
  type SecretKeyAccount,
} from "@umami/core";
import { decrypt } from "@umami/crypto";
import { type RawPkh, deriveSecretKey } from "@umami/tezos";
import { maxBy } from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useGetAccountBalance } from "./assets";
import { useMultisigAccounts } from "./multisig";
import { useAppSelector } from "./useAppSelector";
import { accountsActions } from "../slices";

export const useSeedPhrases = () => useAppSelector(s => s.accounts.seedPhrases);

const useSecretKeys = () => useAppSelector(s => s.accounts.secretKeys);

export const useImplicitAccounts = () => useAppSelector(s => s.accounts.items);

export const useGetImplicitAccountSafe = () => {
  const accounts = useImplicitAccounts();
  return (pkh: RawPkh) => accounts.find(account => account.address.pkh === pkh);
};

// For cleaner code and ease of use this hook returns an ImplicitAccount
// Please make sure not to pass in a non-existing address
export const useGetImplicitAccount = () => {
  const getAccount = useGetImplicitAccountSafe();

  return (pkh: RawPkh) => {
    const account = getAccount(pkh);
    if (!account) {
      throw new Error(`Unknown account: ${pkh}`);
    }
    return account;
  };
};

export const useGetAccountsByType = () => {
  const accounts = useImplicitAccounts();

  return <T extends ImplicitAccount>(type: T["type"]): T[] =>
    accounts.filter((account: Account): account is T => account.type === type);
};

export const useGetAccountsByFingerPrint = () => {
  const getAccountsByType = useGetAccountsByType();

  return (fingerPrint: string) =>
    getAccountsByType<MnemonicAccount>("mnemonic").filter(
      account => account.seedFingerPrint === fingerPrint
    );
};

export const useAllAccounts = (): Account[] => {
  const implicit = useImplicitAccounts();
  const multisig = useMultisigAccounts();
  return [...implicit, ...multisig];
};

export const useGetOwnedAccountSafe = () => {
  const accounts = useAllAccounts();
  return (pkh: string): Account | undefined => accounts.find(a => a.address.pkh === pkh);
};

// For cleaner code and ease of use this hook returns an Account
// Please make sure not to pass in a non-existing address
export const useGetOwnedAccount = () => {
  const getOwnedAccount = useGetOwnedAccountSafe();

  return (pkh: string): Account => {
    const account = getOwnedAccount(pkh);
    if (!account) {
      throw new Error(`Unknown account: ${pkh}`);
    }
    return account;
  };
};

/**
 * it returns a function that takes a password
 * and attempts to decrypt any encrypted credentials we have
 *
 * if no password has been set, it returns null
 *
 * if the provided password is incorrect, it throws an error
 */
export const useValidateMasterPassword = () => {
  const seedPhrases = useSeedPhrases();
  const secretKeys = useSecretKeys();

  const encrypted = Object.values({ ...secretKeys, ...seedPhrases })[0];

  if (!encrypted) {
    return null;
  }

  return async (password: string) => {
    await decrypt(encrypted, password);
    return;
  };
};

export const useIsPasswordSet = () => !!useValidateMasterPassword();

export const useIsOwnedAddress = () => {
  const ownedAccounts = useAllAccounts();
  const addressesSet = new Set(ownedAccounts.map(acc => acc.address.pkh));

  return (address: RawPkh | null | undefined): boolean => !!address && addressesSet.has(address);
};

const useGetMultisigSigners = () => {
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
      case "ledger":
      case "mnemonic":
      case "social":
      case "secret_key":
        return [account];
      case "multisig":
        return getMultisigSigners(account);
    }
  };
};

// The best signer is the one with the most tez
// For implicit accounts it will be the account itself
// For multisig accounts it will be the associated implicit signer with the most tez
export const useGetBestSignerForAccount = () => {
  const getSigners = useGetOwnedSignersForAccount();
  const getMostFundedImplicitAccount = useGetMostFundedImplicitAccount();

  return (account: Account) => getMostFundedImplicitAccount(getSigners(account));
};

export const useGetMostFundedImplicitAccount = () => {
  const getAccountBalance = useGetAccountBalance();

  return (accounts: ImplicitAccount[]) =>
    maxBy(accounts, signer => Number(getAccountBalance(signer.address.pkh) || "0"))!;
};

export const useGetSecretKey = () => {
  const seedPhrases = useSeedPhrases();
  const encryptedSecretKeys = useSecretKeys();

  return async (account: MnemonicAccount | SecretKeyAccount, password: string) => {
    if (account.type === "secret_key") {
      const encryptedSecretKey = encryptedSecretKeys[account.address.pkh];
      if (!encryptedSecretKey) {
        throw new Error(`Missing secret key for account ${account.address.pkh}`);
      }

      return decrypt(encryptedSecretKey, password);
    }

    const encryptedMnemonic = seedPhrases[account.seedFingerPrint];
    if (!encryptedMnemonic) {
      throw new Error(`Missing seedphrase for account ${account.address.pkh}`);
    }

    const mnemonic = await decrypt(encryptedMnemonic, password);
    return deriveSecretKey(mnemonic, account.derivationPath, account.curve);
  };
};

export const useCurrentAccount = (): ImplicitAccount | undefined => {
  const currentAccountAddress = useAppSelector(s => s.accounts.current);
  const dispatch = useDispatch();
  const accounts = useImplicitAccounts();

  const currentAccount = accounts.find(account => account.address.pkh === currentAccountAddress);

  // if the current account went out of sync with the accounts list -> set it to the first available one
  // TODO: test this
  useEffect(() => {
    if (!currentAccount) {
      dispatch(accountsActions.setCurrent(accounts[0]?.address.pkh));
    }
  }, [currentAccount, currentAccountAddress, dispatch, accounts]);

  return currentAccount;
};
