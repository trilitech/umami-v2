import { useCurrentAccount } from "@umami/state";

export const useIsAccountVerified = () => {
  const account = useCurrentAccount();

  return account?.type !== "mnemonic" || account.isVerified;
};
