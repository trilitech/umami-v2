import { type Account } from "./Account";

export const getAccountGroupLabel = (account: Account) => {
  switch (account.type) {
    case "mnemonic":
      return `Seedphrase ${account.seedFingerPrint}`;
    case "social":
      return "Social accounts";
    case "ledger":
      return "Ledger accounts";
    case "secret_key":
      return "Secret key accounts";
    case "multisig":
      return "Multisig accounts";
  }
};
