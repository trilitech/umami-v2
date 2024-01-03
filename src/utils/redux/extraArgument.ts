import { decrypt, encrypt } from "../crypto/AES";
import { derivePublicKeyPair } from "../mnemonic";

export const extraArgument = {
  derivePublicKeyPair,
  decrypt,
  encrypt,
};

export type ExtraArgument = typeof extraArgument;
