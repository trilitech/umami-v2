import { CustomError } from "@umami/utils";

export type Backup = {
  "persist:accounts": string;
  "persist:root": string;
  user_requirements_nonce: string;
};

const isBackupValid = (backup: any) =>
  ["persist:accounts", "persist:root", "user_requirements_nonce"].every(key => key in backup);

export const useRestoreBackup = () => (backup: Backup) => {
  if (isBackupValid(backup)) {
    return restoreBackupFile(backup);
  }

  throw new CustomError("Invalid backup file.");
};

export const restoreBackupFile = (backup: Backup) => {
  for (const key in backup) {
    localStorage.setItem(key, backup[key as keyof Backup]);
  }
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
  link.download = `UmamiBackup_${currentDate}.json`;

  link.click();
};
