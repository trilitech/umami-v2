import { RawPkh } from "../../types/Address";

type AddressKindType = "contact" | "implicit" | "multisig" | "fa1.2" | "fa2" | "baker" | "unknown";

type AddressKindBase = {
  type: AddressKindType;
  pkh: RawPkh;
  label: string | null;
};

export type OwnedImplicitAccountAddress = AddressKindBase & {
  type: "implicit";
  label: string;
};

export type OwnedMultisigAccountAddress = AddressKindBase & {
  type: "multisig";
  label: string;
};

export type FA12Address = AddressKindBase & {
  type: "fa1.2";
  label: string | null;
};

export type FA2Address = AddressKindBase & {
  type: "fa2";
  label: string | null;
};

export type BakerAddress = AddressKindBase & {
  type: "baker";
  label: string;
};

export type ContactAddress = AddressKindBase & {
  type: "contact";
  label: string;
};

export type UnknownAddress = AddressKindBase & {
  type: "unknown";
  label: null;
};

export type AddressKind =
  | OwnedImplicitAccountAddress
  | OwnedMultisigAccountAddress
  | FA12Address
  | FA2Address
  | BakerAddress
  | ContactAddress
  | UnknownAddress;
