import { useCurrentAccount } from "@umami/state";

export const useIsAccountVerified = () => {
  const account = useCurrentAccount();

  return !!account && (account.type !== "mnemonic" || account.isVerified);
};
