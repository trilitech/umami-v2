import { RawPkh } from "../../types/Address";
import {
  BakerAddress,
  ContactAddress,
  OwnedMultisigAddress,
  UnknownAddress,
} from "../AddressTile/types";

export type AddressKindType =
  | "implicit"
  | "multisig"
  | "fa1.2"
  | "fa2"
  | "baker"
  | "contact"
  | "unknown";

type AddressKindBase = {
  type: AddressKindType;
  pkh: RawPkh;
  label: string | null;
};

export type OwnedImplicitAddress = AddressKindBase & {
  type: "implicit";
  label: string;
};

export type FA12Address = AddressKindBase & {
  type: "fa1.2";
  label: null;
};

export type FA2Address = AddressKindBase & {
  type: "fa2";
  label: null;
};

export type AddressKind =
  | OwnedImplicitAddress
  | OwnedMultisigAddress
  | FA12Address
  | FA2Address
  | BakerAddress
  | ContactAddress
  | UnknownAddress;
