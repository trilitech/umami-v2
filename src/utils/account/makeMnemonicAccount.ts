import { MnemonicAccount } from "../../types/Account";
import { parseImplicitPkh } from "../../types/Address";

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
