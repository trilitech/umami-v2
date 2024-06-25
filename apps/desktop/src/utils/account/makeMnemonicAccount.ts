import { type MnemonicAccount } from "@umami/core";
import { parseImplicitPkh } from "@umami/tezos";

export const makeMnemonicAccount = (
  pk: string,
  pkh: string,
  derivationPath: string,
  derivationPathTemplate: string,
  seedFingerPrint: string,
  label: string
): MnemonicAccount => ({
  curve: "ed25519",
  derivationPath,
  derivationPathTemplate,
  pk,
  address: parseImplicitPkh(pkh),
  seedFingerPrint,
  label,
  type: "mnemonic",
});
