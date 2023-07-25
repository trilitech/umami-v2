import { decrypt, encrypt } from "../aes";
import { restoreAccount, restoreMnemonicAccounts } from "../restoreAccounts";

export const extraArgument = {
  restoreAccount,
  restoreMnemonicAccounts,
  decrypt,
  encrypt,
};

export type ExtraArgument = typeof extraArgument;
