import { decrypt, encrypt } from "../crypto/AES";
import { derivePublicKeyPair, restoreRevealedMnemonicAccounts } from "../mnemonic";

export const extraArgument = {
  derivePublicKeyPair,
  restoreRevealedMnemonicAccounts,
  decrypt,
  encrypt,
};

export type ExtraArgument = typeof extraArgument;
