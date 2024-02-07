import { EncryptedData } from "../utils/crypto/types";

export type UmamiV1Backup = {
  version: string;
  derivationPaths: string[];
  recoveryPhrases: EncryptedData[];
};
