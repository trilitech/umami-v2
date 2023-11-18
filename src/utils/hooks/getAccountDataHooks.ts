import { maxBy } from "lodash";
import { Account, MultisigAccount, ImplicitAccount } from "../../types/Account";
import { RawPkh } from "../../types/Address";
import { decrypt } from "../crypto/AES";
import { useAppSelector } from "../redux/hooks";
import { useGetAccountBalance } from "./assetsHooks";
import { useMultisigAccounts } from "./multisigHooks";
import { useContacts } from "./contactsHooks";

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

// Checks if a label is unique among all accounts and contacts.
export const useIsUniqueLabel = () => {
  const accountLabels = useAllAccounts().map(account => account.label);
  const contactNames = Object.values(useContacts()).map(contact => contact.name);
  return (label: string) => ![...accountLabels, ...contactNames].includes(label);
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

export const useIsOwnedAddress = (address: RawPkh) => {
  const ownedAccounts = useAllAccounts();
  return ownedAccounts.map(acc => acc.address.pkh).includes(address);
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
  const accountBalance = useGetAccountBalance();

  return (account: Account) =>
    maxBy(
      getSigners(account),
      signer => accountBalance(signer.address.pkh) || "0"
    ) as ImplicitAccount;
};
