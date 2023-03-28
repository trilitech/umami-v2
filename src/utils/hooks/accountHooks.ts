import accountsSlice from "../store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useGetAccountBalance } from "./assetsHooks";

export const useAccounts = () => {
  return useAppSelector((s) => s.accounts.items);
};

export const useSelectedAccount = () => {
  const pkh = useAppSelector((s) => s.accounts.selected);
  const accounts = useAppSelector((s) => s.accounts.items);

  return pkh === null ? null : accounts.find((a) => a.pkh === pkh);
};

export const useSelectedAccountBalance = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();

  return account && accountBalance(account.pkh);
};

export const useReset = () => {
  const dispatch = useAppDispatch();

  return () => {
    dispatch(accountsSlice.actions.reset());
  };
};
