import { ImplicitAccount } from "../../../../types/Account";
import { RawPkh } from "../../../../types/Address";
import { EncryptedData } from "../../../crypto/types";

export type State = {
  items: ImplicitAccount[];
  //TODO: Rename to encryptedMnemonics
  seedPhrases: Record<string, EncryptedData | undefined>;
  secretKeys: Record<RawPkh, EncryptedData | undefined>;
};
