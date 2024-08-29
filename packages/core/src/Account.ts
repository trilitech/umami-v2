import { type Curves } from "@taquito/signer";
import { type IDP } from "@umami/social-auth";
import { type BigmapId, type ContractAddress, type ImplicitAddress } from "@umami/tezos";

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
  isVerified: boolean;
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

export type MultisigAccount = {
  type: "multisig";
  label: string;
  address: ContractAddress;
  threshold: number;
  signers: ImplicitAddress[];
  pendingOperationsBigmapId: BigmapId;
};

export type ImplicitAccount = MnemonicAccount | SocialAccount | LedgerAccount | SecretKeyAccount;

export type Account = ImplicitAccount | MultisigAccount;

export type AccountType = Account["type"];

export const DEFAULT_ACCOUNT_LABEL = "Account";
