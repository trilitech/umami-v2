import { DEFAULT_ACCOUNT_LABEL } from "@umami/core";
import { type EncryptedData, decrypt, encrypt } from "@umami/crypto";
import { CustomError } from "@umami/utils";
import { type Persistor } from "redux-persist";

import { useValidateMasterPassword } from "./getAccountData";
import { useRestoreFromMnemonic } from "./setAccountData";

const isV1Backup = (backup: any) => backup["recoveryPhrases"] && backup["derivationPaths"];

const isV2Backup = (backup: any) => !!backup["persist:accounts"];

const isV21Backup = (backup: any) => ["data", "iv", "salt"].every(key => key in backup);

export const useRestoreBackup = () => {
  const restoreV1 = useRestoreV1BackupFile();

  return async (backup: any, password: string, persistor: Persistor) => {
    if (isV1Backup(backup)) {
      return restoreV1(backup, password);
    }
    if (isV2Backup(backup)) {
      return restoreV2BackupFile(backup, password, persistor);
    }
    if (isV21Backup(backup)) {
      return restoreV21BackupFile(backup, password, persistor);
    }
    throw new CustomError("Invalid backup file.");
  };
};

type V1Backup = { recoveryPhrases: [EncryptedData]; derivationPaths: [string] };
export const useRestoreV1BackupFile = () => {
  const restoreFromMnemonic = useRestoreFromMnemonic();

  return async (backup: V1Backup, password: string) => {
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

type V2Backup = { "persist:accounts": string; "persist:root": string };
export const restoreV2BackupFile = async (
  backup: V2Backup,
  password: string,
  persistor: Persistor
) => {
  const accountsInString: string = backup["persist:accounts"];
  if (!accountsInString) {
    throw new CustomError("Invalid backup file.");
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

export const restoreV21BackupFile = async (
  encryptedBackup: EncryptedData,
  password: string,
  persistor: Persistor
) => {
  const backup = JSON.parse(await decrypt(encryptedBackup, password, "V2")) as V2Backup;
  return restoreV2BackupFile(backup, password, persistor);
};

export const useDownloadBackupFile = () => {
  const validateMasterPassword = useValidateMasterPassword();

  return async (password: string) => {
    await validateMasterPassword?.(password);

    const storage = {
      "persist:accounts": localStorage.getItem("persist:accounts"),
      "persist:root": localStorage.getItem("persist:root"),
    };
    const rawBackup = JSON.stringify(storage);
    const encryptedBackup = await encrypt(rawBackup, password);

    const link = document.createElement("a");

    const currentDate = new Date().toISOString().slice(0, 10);
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(encryptedBackup))}`;
    link.download = `UmamiV2Backup_${currentDate}.json`;

    link.click();
  };
};
