import { UmamiEncrypted } from "./UmamiEncrypted";

export enum AccountType {
  LEDGER = "ledger",
  SOCIAL = "social",
  MNEMONIC = "mnemonic",
}

type Base = {
  pkh: string;
  pk: string;
};

export type UnencryptedAccount = Base & {
  sk: string;
};

export type LedgerAccount = Base & {
  label?: string;
  type: AccountType.LEDGER;
};

export type SocialAccount = Base & {
  label?: string;
  type: AccountType.SOCIAL;
  idp: "google";
};

export type MnemonicAccount = Base & {
  label?: string;
  type: AccountType.MNEMONIC;
  seedFingerPrint?: string;
  esk: UmamiEncrypted;
};

// Account in store can only be Mnemonic or Social
export type Account = MnemonicAccount | SocialAccount | LedgerAccount;
