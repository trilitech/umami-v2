import { decrypt } from "../../../utils/crypto/AES";
import { EncryptedData } from "../../../utils/crypto/types";
import { useRestoreFromMnemonic } from "../../../utils/hooks/accountHooks";

export const useRestoreV1BackupFile = () => {
  const restoreFromMnemonic = useRestoreFromMnemonic();
  return async (
    backup: { recoveryPhrases: [EncryptedData]; derivationPaths: [string] },
    password: string
  ) => {
    const encrypted: [EncryptedData] = backup["recoveryPhrases"];
    // The prefix `m/` from V1 can be ignored.
    const derivationPaths = backup.derivationPaths.map((path: string) =>
      path.slice(0, 2) === "m/" ? path.slice(2) : path
    );

    localStorage.clear();
    try {
      for (const [i, encryptedMnemonic] of encrypted.entries()) {
        const mnemonic = await decrypt(encryptedMnemonic, password, "V1");
        await restoreFromMnemonic(mnemonic, password, undefined, derivationPaths[i]);
      }
    } catch (e) {
      throw new Error("Invalid password.");
    }
  };
};

export const restoreV2BackupFile = async (
  backup: { "persist:accounts": string; "persist:root": string },
  password: string
) => {
  const accountsInString: string = backup["persist:accounts"];
  if (!accountsInString) {
    throw new Error("Invalid backup file");
  }

  const accounts: { seedPhrases: string } = JSON.parse(accountsInString);
  const encryptedMnemonics: Record<string, EncryptedData> = JSON.parse(accounts.seedPhrases);

  try {
    for (const encrypted of Object.values(encryptedMnemonics)) {
      await decrypt(encrypted, password, "V2");
    }
  } catch (e) {
    throw new Error("Invalid password.");
  }

  localStorage.clear();
  localStorage.setItem("persist:accounts", accountsInString);
  localStorage.setItem("persist:root", backup["persist:root"]);
};
