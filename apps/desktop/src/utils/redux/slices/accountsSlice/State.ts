import { type ImplicitAccount } from "@umami/core";
import { type RawPkh } from "@umami/tezos";

import { type EncryptedData } from "../../../crypto/types";

export type State = {
  items: ImplicitAccount[];
  //TODO: Rename to encryptedMnemonics
  seedPhrases: Record<string, EncryptedData | undefined>;
  secretKeys: Record<RawPkh, EncryptedData | undefined>;
};
