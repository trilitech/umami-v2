import { RawPkh } from "../../types/Address";

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

export type AddressKind = OwnedAddress | BakerAddress | ContactAddress | UnknownAddress;
