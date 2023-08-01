import { decrypt, encrypt } from "../aes";
import { derivePublicKeyPair, restoreRevealedMnemonicAccounts } from "../mnemonic";

export const extraArgument = {
  derivePublicKeyPair,
  restoreRevealedMnemonicAccounts,
  decrypt,
  encrypt,
};

export type ExtraArgument = typeof extraArgument;
