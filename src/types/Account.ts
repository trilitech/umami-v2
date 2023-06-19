import { Curves } from "@taquito/signer";
import { MultisigOperation } from "../utils/multisig/types";
import { ContractAddress, ImplicitAddress } from "./Address";

export enum AccountType {
  SOCIAL = "social",
  MNEMONIC = "mnemonic",
  LEDGER = "ledger",
  MULTISIG = "multisig",
}

export type SocialAccount = {
  label: string;
  type: AccountType.SOCIAL;
  idp: "google";
  address: ImplicitAddress;
};

export type MnemonicAccount = {
  label: string;
  curve: "ed25519";
  derivationPath: string;
  type: AccountType.MNEMONIC;
  seedFingerPrint: string;
  address: ImplicitAddress;
};

export type LedgerAccount = {
  label: string;
  curve: Curves;
  derivationPath: string;
  type: AccountType.LEDGER;
  address: ImplicitAddress;
};

export type MultisigAccount = {
  type: AccountType.MULTISIG;
  address: ContractAddress;
  label: string;
  threshold: number;
  signers: ImplicitAddress[];
  balance: string; // TODO remove
  operations: MultisigOperation[]; // TODO remove
};

export type ImplicitAccount = MnemonicAccount | SocialAccount | LedgerAccount;

export type Account = ImplicitAccount | MultisigAccount;
