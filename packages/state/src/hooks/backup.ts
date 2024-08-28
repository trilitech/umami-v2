import { DEFAULT_ACCOUNT_LABEL } from "@umami/core";
import { type EncryptedData, decrypt } from "@umami/crypto";
import { type Persistor } from "redux-persist";

import { useRestoreFromMnemonic } from "./setAccountData";

const isV1Backup = (backup: any) => backup["recoveryPhrases"] && backup["derivationPaths"];

const isV2Backup = (backup: any) => !!backup["persist:accounts"];

export const useRestoreBackup = () => {
  const restoreV1 = useRestoreV1BackupFile();

  return async (backup: any, password: string, persistor: Persistor) => {
    if (isV1Backup(backup)) {
      return restoreV1(backup, password);
    }
    if (isV2Backup(backup)) {
      return restoreV2BackupFile(backup, password, persistor);
    }
    throw new Error("Invalid backup file.");
  };
};

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

    const mnemonics = [];

    for (const encryptedMnemonic of encrypted) {
      mnemonics.push(await decrypt(encryptedMnemonic, password, "V1"));
    }

    for (const [i, mnemonic] of mnemonics.entries()) {
      await restoreFromMnemonic({
        mnemonic,
        password,
        label: DEFAULT_ACCOUNT_LABEL,
        derivationPathTemplate: derivationPaths[i],
        curve: "ed25519",
      });
    }
  };
};

export const restoreV2BackupFile = async (
  backup: { "persist:accounts": string; "persist:root": string },
  password: string,
  persistor: Persistor
) => {
  const accountsInString: string = backup["persist:accounts"];
  if (!accountsInString) {
    throw new Error("Invalid backup file.");
  }

  const accounts: { seedPhrases: string } = JSON.parse(accountsInString);

  const encryptedMnemonics: Record<string, EncryptedData> = JSON.parse(accounts.seedPhrases);

  for (const encrypted of Object.values(encryptedMnemonics)) {
    await decrypt(encrypted, password, "V2");
  }

  persistor.pause();

  localStorage.clear();
  localStorage.setItem("persist:accounts", accountsInString);
  localStorage.setItem("persist:root", backup["persist:root"]);

  window.location.reload();
};

export const downloadBackupFile = () => {
  const storage = {
    "persist:accounts": localStorage.getItem("persist:accounts"),
    "persist:root": localStorage.getItem("persist:root"),
  };

  const downloadedDate = new Date().toISOString().slice(0, 10);

  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(storage))}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `UmamiV2Backup_${downloadedDate}.json`;

  link.click();
};
