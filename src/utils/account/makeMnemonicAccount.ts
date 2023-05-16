import { AccountType, MnemonicAccount } from "../../types/Account";
import { getFullDerivationPath } from "./derivationPathUtils";

export const makeMnemonicAccount = (
  pk: string,
  pkh: string,
  derivationIndex: number,
  seedFingerPrint: string,
  label: string
): MnemonicAccount => {
  return {
    curve: "ed25519",
    derivationPath: getFullDerivationPath(derivationIndex),
    pk,
    pkh,
    seedFingerPrint,
    label,
    type: AccountType.MNEMONIC,
  };
};
