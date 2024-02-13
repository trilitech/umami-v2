import BigNumber from "bignumber.js";
import { compact } from "lodash";

import { useSecretKeys, useSeedPhrases } from "./getAccountDataHooks";
import { MnemonicAccount, SecretKeyAccount } from "../../types/Account";
import { decrypt } from "../crypto/AES";
import { deriveSecretKey } from "../mnemonic";

export const getTotalTezBalance = (
  balances: Record<string, string | undefined>
): BigNumber | null => {
  const filtered = compact(Object.values(balances));

  if (filtered.length === 0) {
    return null;
  }

  return filtered.reduce((acc, curr) => acc.plus(curr), new BigNumber(0));
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
