import { useCurrentAccount, useImplicitAccounts } from "@umami/state";

export const useIsAccountVerified = () => {
  const account = useCurrentAccount();

  return !!account && (account.type !== "mnemonic" || account.isVerified);
};

export const useHasVerifiedAccounts = () => {
  const accounts = useImplicitAccounts();

  for (const account of accounts) {
    if (account.type !== "mnemonic" || account.isVerified) {
      return true;
    }
  }

  return false;
};
