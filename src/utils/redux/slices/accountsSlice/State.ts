import { type ImplicitAccount } from "../../../../types/Account";
import { type RawPkh } from "../../../../types/Address";
import { type EncryptedData } from "../../../crypto/types";

export type State = {
  items: ImplicitAccount[];
  //TODO: Rename to encryptedMnemonics
  seedPhrases: Record<string, EncryptedData | undefined>;
  secretKeys: Record<RawPkh, EncryptedData | undefined>;
};
