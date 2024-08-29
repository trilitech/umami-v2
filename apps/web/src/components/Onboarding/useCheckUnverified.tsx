import { useCurrentAccount } from "@umami/state";

export const useCheckVerified = () => {
  const currentAccount = useCurrentAccount()!;

  if (currentAccount.type === "mnemonic") {
    return currentAccount.isVerified;
  }

  return true;
};
