import { MnemonicAccount } from "../../types/Account";
import { parseImplicitPkh } from "../../types/Address";

export const makeMnemonicAccount = (
  pk: string,
  pkh: string,
  derivationPath: string,
  derivationPathPattern: string,
  seedFingerPrint: string,
  label: string
): MnemonicAccount => {
  return {
    curve: "ed25519",
    derivationPath,
    derivationPathPattern,
    pk,
    address: parseImplicitPkh(pkh),
    seedFingerPrint,
    label,
    type: "mnemonic",
  };
};
