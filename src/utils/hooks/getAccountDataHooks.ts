import { maxBy } from "lodash";

import { useGetAccountBalance } from "./assetsHooks";
import { useContacts } from "./contactsHooks";
import { useMultisigAccounts } from "./multisigHooks";
import {
  Account,
  ImplicitAccount,
  MnemonicAccount,
  MultisigAccount,
  SecretKeyAccount,
} from "../../types/Account";
import { RawPkh } from "../../types/Address";
import { decrypt } from "../crypto/AES";
import { useAppSelector } from "../redux/hooks";
import { deriveSecretKey } from "../tezos";

export const useSeedPhrases = () => useAppSelector(s => s.accounts.seedPhrases);

const useSecretKeys = () => useAppSelector(s => s.accounts.secretKeys);

export const useImplicitAccounts = () => useAppSelector(s => s.accounts.items);

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

export const useAllAccounts = (): Account[] => {
  const implicit = useImplicitAccounts();
  const multisig = useMultisigAccounts();
  return [...implicit, ...multisig];
};

/** Checks if a label is unique among all accounts and contacts. */
export const useIsUniqueLabel = () => {
  const accountLabels = useAllAccounts().map(account => account.label);
  const contactNames = Object.values(useContacts()).map(contact => contact.name);
  return (label: string) => ![...accountLabels, ...contactNames].includes(label);
};

/** Hook for generating unique account labels. */
export const useGetNextAvailableAccountLabels = () => {
  const isUniqueLabel = useIsUniqueLabel();

  return (labelPrefix: string, count: number = 1) => {
    const labels = [];
    for (let index = 1; labels.length < count; index++) {
      const nextLabel = index === 1 ? labelPrefix : `${labelPrefix} ${index}`;
      if (isUniqueLabel(nextLabel)) {
        labels.push(nextLabel);
      }
    }
    return labels;
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

export const useIsOwnedAddress = (address: RawPkh) => {
  const ownedAccounts = useAllAccounts();
  return ownedAccounts.map(acc => acc.address.pkh).includes(address);
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
    } else {
      const encryptedMnemonic = seedPhrases[account.seedFingerPrint];
      if (!encryptedMnemonic) {
        throw new Error(`Missing seedphrase for account ${account.address.pkh}`);
      }

      const mnemonic = await decrypt(encryptedMnemonic, password);
      return deriveSecretKey(mnemonic, account.derivationPath, account.curve);
    }
  };
};
