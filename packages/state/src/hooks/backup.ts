import { type EncryptedData, decrypt } from "@umami/crypto";
import { CustomError } from "@umami/utils";
import { type Persistor } from "redux-persist";

type Backup = {
  "persist:accounts": string;
  "persist:root": string;
  user_requirements_nonce: string;
};

const isBackupValid = (backup: any) =>
  ["persist:accounts", "persist:root", "user_requirements_nonce"].every(key => key in backup);

export const useRestoreBackup =
  () => async (backup: string, password: string, persistor: Persistor) => {
    try {
      const parsedBackup = JSON.parse(backup) as any;

      if (isBackupValid(parsedBackup)) {
        return restoreBackupFile(parsedBackup, password, persistor);
      }
    } catch {
      throw new CustomError("Invalid backup file.");
    }
  };

export const restoreBackupFile = async (backup: Backup, password: string, persistor: Persistor) => {
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
  localStorage.setItem("migration_to_2_3_5_completed", "true");
  localStorage.setItem("persist:accounts", accountsInString);
  localStorage.setItem("persist:root", backup["persist:root"]);

  window.location.reload();
};

export const useDownloadBackupFile = () => () => {
  const storage = {
    "persist:accounts": localStorage.getItem("persist:accounts"),
    "persist:root": localStorage.getItem("persist:root"),
    user_requirements_nonce: localStorage.getItem("user_requirements_nonce"),
  };

  const rawBackup = JSON.stringify(storage);

  const link = document.createElement("a");

  const currentDate = new Date().toISOString().slice(0, 10);
  link.href = `data:text/json;charset=utf-8,${encodeURIComponent(rawBackup)}`;
  link.download = `UmamiV2Backup_${currentDate}.json`;

  link.click();
};
