import { useCurrentAccount } from "@umami/state";

export const useCheckVerified = () => {
  const account = useCurrentAccount()!;

  if (account.type === "mnemonic") {
    return account.isVerified;
  }

  return true;
};
