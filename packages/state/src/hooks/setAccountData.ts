import {
  type ImplicitAccount,
  type LedgerAccount,
  type MnemonicAccount,
  type SecretKeyAccount,
  type SocialAccount,
} from "@umami/core";
import { decrypt, encrypt } from "@umami/crypto";
import { type IDP } from "@umami/social-auth";
import { derivePublicKeyPair, getFingerPrint, makeDerivationPath } from "@umami/tezos";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  useGetAccountsByFingerPrint,
  useGetAccountsByType,
  useImplicitAccounts,
  useSeedPhrases,
} from "./getAccountData";
import { useGetNextAvailableAccountLabels } from "./labels";
import { useRestoreRevealedMnemonicAccounts } from "./mnemonic";
import { useSelectedNetwork } from "./network";
import { useRemoveDependenciesAndMultisigs } from "./removeAccountDependencies";
import { useAppDispatch } from "./useAppDispatch";
import { accountsActions } from "../slices";
import { restoreFromSecretKey } from "../thunks";

const { removeMnemonicAndAccounts, removeNonMnemonicAccounts, addAccount } = accountsActions;

/**
 * Restores accounts from a mnemonic group when it's being added by an existing seedphrase.
 *
 * Creates some revealed mnemonic accounts matching given {@link derivationPath},
 * or, if no accounts were revealed, an account with the smallest derivation path (accountIndex = 0).
 * Check {@link useRestoreRevealedMnemonicAccounts} for logic of restoring revealed accounts.
 *
 * Restored accounts and their encrypted mnemonic are added to the {@link accountsSlice}.
 *
 * @param mnemonic - Space separated words making a BIP39 seed phrase.
 * @param password - User's password, used for encrypting mnemonic.
 * @param derivationPathTemplate - Path pattern for the account group that's being added.
 * @param label - Account group prefix.
 */
export const useRestoreFromMnemonic = () => {
  const network = useSelectedNetwork();
  const restoreRevealedMnemonicAccounts = useRestoreRevealedMnemonicAccounts();
  const dispatch = useDispatch();
  return async ({
    mnemonic,
    password,
    derivationPathTemplate,
    label,
  }: {
    mnemonic: string;
    password: string;
    derivationPathTemplate: string;
    label: string;
  }) => {
    const seedFingerprint = await getFingerPrint(mnemonic);
    const accounts = await restoreRevealedMnemonicAccounts(
      mnemonic,
      network,
      derivationPathTemplate,
      label
    );
    const encryptedMnemonic = await encrypt(mnemonic, password);

    dispatch(
      accountsActions.addMnemonicAccounts({
        seedFingerprint,
        accounts,
        encryptedMnemonic,
      })
    );
  };
};

/**
 * Adds account to a mnemonic group.
 *
 * The account is not guaranteed to not been used before.
 * It could have been revealed (and used) in the past, but skipped after deleting a group and restoring it after.
 *
 * New account is added to the {@link accountsSlice}.
 *
 * @param fingerPrint - Hash of the mnemonic. Generated with {@link getFingerPrint}. We use it to group together accounts derived from the same mnemonic
 * @param password - User's password, used for decrypting the mnemonic.
 * @param label - Account name prefix, used to create a unique account name.
 */
export const useDeriveMnemonicAccount = () => {
  const encryptedMnemonics = useSeedPhrases();
  const implicitAccounts = useImplicitAccounts();
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const dispatch = useDispatch();

  return async ({
    fingerPrint,
    password,
    label,
  }: {
    fingerPrint: string;
    password: string;
    label: string;
  }) => {
    const encryptedSeedphrase = encryptedMnemonics[fingerPrint];
    if (!encryptedSeedphrase) {
      throw new Error(`No seedphrase found with fingerprint: ${fingerPrint}`);
    }
    const seedphrase = await decrypt(encryptedSeedphrase, password);

    const existingGroupAccounts = implicitAccounts.filter(
      (acc): acc is MnemonicAccount =>
        acc.type === "mnemonic" && acc.seedFingerPrint === fingerPrint
    );
    // We can only delete the whole group, so skipped indexes are not possible.
    const nextIndex = existingGroupAccounts.length;

    // Newly derived accounts use a derivation path in the same pattern as the first account
    const pattern = existingGroupAccounts[0].derivationPathTemplate;

    const nextDerivationPath = makeDerivationPath(pattern, nextIndex);
    const { pk, pkh } = await derivePublicKeyPair(seedphrase, nextDerivationPath);

    const uniqueLabel = getNextAvailableAccountLabels(label, 1)[0];
    const account: MnemonicAccount = {
      type: "mnemonic",
      curve: "ed25519",
      pk,
      address: { type: "implicit", pkh },
      derivationPath: nextDerivationPath,
      seedFingerPrint: fingerPrint,
      derivationPathTemplate: pattern,
      label: uniqueLabel,
    };

    dispatch(accountsActions.addAccount(account));
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
  return (
    derivationPathTemplate: string | undefined,
    derivationPath: string,
    pk: string,
    pkh: string,
    label: string
  ) => {
    const account: LedgerAccount = {
      derivationPathTemplate,
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

  return useCallback(
    (pk: string, pkh: string, label: string, idp: IDP) => {
      const account: SocialAccount = {
        type: "social",
        pk: pk,
        address: { type: "implicit", pkh },
        idp,
        label,
      };
      dispatch(addAccount(account));
    },
    [dispatch]
  );
};

/**
 * Hook for removing all accounts from mnemonic group by a given fingerprint.
 *
 * Also removes accounts' dependencies and obsolete multisigs.
 */
export const useRemoveMnemonic = () => {
  const dispatch = useAppDispatch();
  const getAccountsByFingerPrint = useGetAccountsByFingerPrint();
  const removeDependenciesAndMultisigs = useRemoveDependenciesAndMultisigs();

  return (fingerPrint: string) => {
    removeDependenciesAndMultisigs(getAccountsByFingerPrint(fingerPrint));

    dispatch(
      removeMnemonicAndAccounts({
        fingerPrint,
      })
    );
  };
};

/**
 * Hook for removing all accounts of a given type.
 *
 * Also removes accounts' dependencies and obsolete multisigs.
 */
export const useRemoveNonMnemonic = () => {
  const dispatch = useAppDispatch();
  const getAccountsByType = useGetAccountsByType();
  const removeDependenciesAndMultisigs = useRemoveDependenciesAndMultisigs();

  return (accountType: ImplicitAccount["type"]) => {
    removeDependenciesAndMultisigs(getAccountsByType(accountType));

    dispatch(
      removeNonMnemonicAccounts({
        accountType,
      })
    );
  };
};

/**
 * Hook for removing single account.
 *
 * Also removes account's dependencies and obsolete multisigs.
 */
export const useRemoveAccount = () => {
  const dispatch = useAppDispatch();
  const removeDependenciesAndMultisigs = useRemoveDependenciesAndMultisigs();

  return (account: SocialAccount | LedgerAccount | SecretKeyAccount) => {
    removeDependenciesAndMultisigs([account]);

    dispatch(accountsActions.removeAccount(account));
  };
};
