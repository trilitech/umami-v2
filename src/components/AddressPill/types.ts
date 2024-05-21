import { RawPkh } from "../../types/Address";
import {
  BakerAddress,
  ContactAddress,
  OwnedMultisigAddress,
  UnknownAddress,
} from "../AddressTile/types";

export type OwnedImplicitAddress = {
  type: "implicit";
  pkh: RawPkh;
  label: string;
};

export type FA12Address = {
  type: "fa1.2";
  pkh: RawPkh;
  label: null;
};

export type FA2Address = {
  type: "fa2";
  pkh: RawPkh;
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
