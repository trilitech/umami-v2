export type UmamiEncrypted = {
  data: string;
  iv: string;
  salt: string;
};

export type UmamiBackup = {
  version: string;
  derivationPaths: string[];
  recoveryPhrases: UmamiEncrypted[];
};
