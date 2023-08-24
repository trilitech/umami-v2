import BigNumber from "bignumber.js";
import { compact } from "lodash";
import { MnemonicAccount } from "../../types/Account";
import { decrypt } from "../crypto/AES";
import { deriveSecretKey } from "../mnemonic";
import { useAppSelector } from "../redux/hooks";

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
  const mnemonics = useAppSelector(s => s.accounts.mnemonics);
  return async (account: MnemonicAccount, password: string) => {
    const encryptedMnemonic = mnemonics[account.seedFingerPrint];
    if (!encryptedMnemonic) {
      throw new Error(`Missing mnemonic for account ${account.address.pkh}`);
    }

    try {
      const mnemonic = await decrypt(encryptedMnemonic, password);
      return deriveSecretKey(mnemonic, account.derivationPath, account.curve);
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error("Failed to decrypt with the provided password");
    }
  };
};
