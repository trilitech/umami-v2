import { Account } from "../../types/Account";

export const getAccountGroupLabel = (account: Account) => {
  switch (account.type) {
    case "mnemonic":
      return `Seedphrase ${account.seedFingerPrint}`;
    case "social":
      return "Social Accounts";
    case "ledger":
      return "Ledger Accounts";
    case "secret_key":
      return "Secret Key Accounts";
    case "multisig":
      return "Multisig Accounts";
  }
};
