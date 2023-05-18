import { AccountType, MnemonicAccount } from "../../types/Account";

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
    pkh,
    seedFingerPrint,
    label,
    type: AccountType.MNEMONIC,
  };
};
