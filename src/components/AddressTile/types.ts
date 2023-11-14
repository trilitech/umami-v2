import { RawPkh } from "../../types/Address";

export type AddressKindType =
  | "mnemonic"
  | "secret_key"
  | "social"
  | "ledger"
  | "multisig"
  | "baker"
  | "contact"
  | "unknown";

type AddressKindBase = {
  type: AddressKindType;
  pkh: RawPkh;
  label: string | null;
};

type MnemonicAddress = AddressKindBase & { type: "mnemonic"; label: string };
type SecretKeyAddress = AddressKindBase & { type: "secret_key"; label: string };
type SocialAddress = AddressKindBase & { type: "social"; label: string };
type LedgerAddress = AddressKindBase & { type: "ledger"; label: string };
export type OwnedMultisigAddress = AddressKindBase & { type: "multisig"; label: string };
export type BakerAddress = AddressKindBase & { type: "baker"; label: string };
export type ContactAddress = AddressKindBase & { type: "contact"; label: string };
export type UnknownAddress = AddressKindBase & { type: "unknown"; label: null };

export type OwnedAddress =
  | MnemonicAddress
  | SocialAddress
  | SecretKeyAddress
  | LedgerAddress
  | OwnedMultisigAddress;

export type AddressKind = OwnedAddress | BakerAddress | ContactAddress | UnknownAddress;
