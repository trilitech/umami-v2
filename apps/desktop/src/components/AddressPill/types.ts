import { type RawPkh } from "@umami/tezos";

import {
  type BakerAddress,
  type ContactAddress,
  type OwnedMultisigAddress,
  type UnknownAddress,
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
