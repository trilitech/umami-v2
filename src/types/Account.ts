import { Curves } from "@taquito/signer";
import { MultisigOperation, WalletAccountPkh } from "../utils/multisig/types";

export enum AccountType {
  SOCIAL = "social",
  MNEMONIC = "mnemonic",
  LEDGER = "ledger",
  MULTISIG = "multisig",
}

type Base = {
  pkh: string;
  pk: string;
};

export type UnencryptedAccount = Base;

export type SocialAccount = Base & {
  label: string;
  type: AccountType.SOCIAL;
  idp: "google";
};

export type MnemonicAccount = Base & {
  label: string;
  curve: "ed25519";
  derivationPath: string;
  type: AccountType.MNEMONIC;
  seedFingerPrint: string;
};

export type LedgerAccount = Base & {
  label: string;
  curve: Curves;
  derivationPath: string;
  type: AccountType.LEDGER;
};

export type MultisigAccount = {
  type: AccountType.MULTISIG;
  pkh: string;
  label: string;
  threshold: number;
  signers: WalletAccountPkh[];
  balance: string;
  operations: MultisigOperation[];
};

export type ImplicitAccount = MnemonicAccount | SocialAccount | LedgerAccount;

export type AllAccount = ImplicitAccount | MultisigAccount;
