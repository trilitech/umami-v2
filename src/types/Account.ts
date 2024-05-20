import { Curves } from "@taquito/signer";

import { ImplicitAddress } from "./Address";
import { IDP } from "../auth";
import { Multisig } from "../utils/multisig/types";

export type SocialAccount = {
  label: string;
  type: "social";
  idp: IDP;
  address: ImplicitAddress;
  pk: string;
};

export type MnemonicAccount = {
  label: string;
  curve: Curves;
  derivationPath: string;
  derivationPathTemplate: string;
  type: "mnemonic";
  seedFingerPrint: string;
  address: ImplicitAddress;
  pk: string;
};

export type LedgerAccount = {
  label: string;
  curve: Curves;
  derivationPath: string;
  derivationPathTemplate: string | undefined;
  type: "ledger";
  address: ImplicitAddress;
  pk: string;
};

export type SecretKeyAccount = {
  label: string;
  curve: Curves;
  type: "secret_key";
  address: ImplicitAddress;
  pk: string;
};

export type MultisigAccount = Multisig & {
  type: "multisig";
  label: string;
};

export type ImplicitAccount = MnemonicAccount | SocialAccount | LedgerAccount | SecretKeyAccount;

export type Account = ImplicitAccount | MultisigAccount;

export type AccountType = Account["type"];
