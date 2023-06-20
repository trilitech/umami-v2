import { AccountType, MnemonicAccount } from "../../types/Account";
import { parseImplicitPkh } from "../../types/Address";

export const makeMnemonicAccount = (
  pk: string,
  pkh: string,
  derivationPath: string,
  seedFingerPrint: string,
  label: string
): MnemonicAccount => {
  return {
    curve: "ed25519",
    derivationPath,
    pk,
    address: parseImplicitPkh(pkh),
    seedFingerPrint,
    label,
    type: AccountType.MNEMONIC,
  };
};
