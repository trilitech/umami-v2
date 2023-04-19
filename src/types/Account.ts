import { Curves } from "@taquito/signer";

export enum AccountType {
  SOCIAL = "social",
  MNEMONIC = "mnemonic",
  Ledger = "ledger",
}

type Base = {
  pkh: string;
  pk: string;
};

export type UnencryptedAccount = Base & {
  sk: string;
};

export type SocialAccount = Base & {
  label?: string;
  type: AccountType.SOCIAL;
  idp: "google";
};

export type MnemonicAccount = Base & {
  label?: string;
  curve: "ed25519";
  derivationPath: string;
  type: AccountType.MNEMONIC;
  seedFingerPrint: string;
};

export type LedgerAccount = Base & {
  label?: string;
  curve: Curves;
  derivationPath: string;
  type: AccountType.Ledger;
};

export type Account = MnemonicAccount | SocialAccount | LedgerAccount;
