import { type RawPkh } from "@umami/tezos";

type MnemonicAddress = { type: "mnemonic"; pkh: RawPkh; label: string };
type SecretKeyAddress = { type: "secret_key"; pkh: RawPkh; label: string };
type SocialAddress = { type: "social"; pkh: RawPkh; label: string };
type LedgerAddress = { type: "ledger"; pkh: RawPkh; label: string };
export type OwnedMultisigAddress = { type: "multisig"; pkh: RawPkh; label: string };
export type BakerAddress = { type: "baker"; pkh: RawPkh; label: string };
export type ContactAddress = { type: "contact"; pkh: RawPkh; label: string };
export type UnknownAddress = { type: "unknown"; pkh: RawPkh; label: null };

export type OwnedAddress =
  | MnemonicAddress
  | SocialAddress
  | SecretKeyAddress
  | LedgerAddress
  | OwnedMultisigAddress;

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
  | OwnedAddress
  | FA12Address
  | FA2Address
  | BakerAddress
  | ContactAddress
  | UnknownAddress;

export type AddressPillMode = "default" | "no_icons";

export const KNOWN_ADDRESS_TYPES = [
  "mnemonic",
  "social",
  "secret_key",
  "ledger",
  "multisig",
  "baker",
];
