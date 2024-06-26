type Hex = string;

export type EncryptedData = {
  iv: Hex;
  salt: Hex;
  data: Hex;
};

export type UmamiV1Backup = {
  version: string;
  derivationPaths: string[];
  recoveryPhrases: EncryptedData[];
};
