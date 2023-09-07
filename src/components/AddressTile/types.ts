import { RawPkh } from "../../types/Address";

export type AddressKindType =
  | "mnemonic"
  | "social"
  | "ledger"
  | "ownedMultisig"
  | "baker"
  | "contact"
  | "unknown";

type AddressKindBase = {
  type: AddressKindType;
  pkh: RawPkh;
  label: string | null;
};

type MnemonicAddress = AddressKindBase & { type: "mnemonic"; label: string };
type SocialAddress = AddressKindBase & { type: "social"; label: string };
type LedgergAddress = AddressKindBase & { type: "ledger"; label: string };
type OwnedMultisigAddress = AddressKindBase & { type: "ownedMultisig"; label: string };
export type BakerAddress = AddressKindBase & { type: "baker"; label: string };
export type ContactAddress = AddressKindBase & { type: "contact"; label: string };
export type UnknownAddress = AddressKindBase & { type: "unknown"; label: null };

export type OwnedAddreess = MnemonicAddress | SocialAddress | LedgergAddress | OwnedMultisigAddress;

export type AddressKind = OwnedAddreess | BakerAddress | ContactAddress | UnknownAddress;
