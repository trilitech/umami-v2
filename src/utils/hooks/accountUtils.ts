import BigNumber from "bignumber.js";
import { compact } from "lodash";
import { MnemonicAccount } from "../../types/Account";
import { decrypt } from "../aes";
import { deriveSkFromMnemonic } from "../restoreAccounts";
import { useAppSelector } from "../store/hooks";

export const getTotalTezBalance = (
  balances: Record<string, string | undefined>
): BigNumber | null => {
  const filtered = compact(Object.values(balances));

  if (filtered.length === 0) {
    return null;
  }

  return filtered.reduce((acc, curr) => acc.plus(curr), new BigNumber(0));
};

export const useGetSk = () => {
  const seedPhrases = useAppSelector(s => s.accounts.seedPhrases);
  return async (a: MnemonicAccount, password: string) => {
    const encryptedMnemonic = seedPhrases[a.seedFingerPrint];
    if (!encryptedMnemonic) {
      throw new Error(`Missing seedphrase for account ${a.address.pkh}`);
    }

    const mnemonic = await decrypt(encryptedMnemonic, password);
    return deriveSkFromMnemonic(mnemonic, a.derivationPath, a.curve);
  };
};
