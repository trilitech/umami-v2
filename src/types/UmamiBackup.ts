import { EncryptedData } from "../utils/crypto/types";

export type UmamiBackup = {
  version: string;
  derivationPaths: string[];
  recoveryPhrases: EncryptedData[];
};
