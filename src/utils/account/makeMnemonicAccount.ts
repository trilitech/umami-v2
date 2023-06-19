import { AccountType, MnemonicAccount } from "../../types/Account";

export const makeMnemonicAccount = (
  pkh: string,
  derivationPath: string,
  seedFingerPrint: string,
  label: string
): MnemonicAccount => {
  return {
    curve: "ed25519",
    derivationPath,
    address: { type: "implicit", pkh: pkh },
    seedFingerPrint,
    label,
    type: AccountType.MNEMONIC,
  };
};
