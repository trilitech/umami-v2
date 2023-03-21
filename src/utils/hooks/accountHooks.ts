import accountsSlice from "../store/accountsSlice";
import { balance } from "../store/assetsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getTotalBalance } from "./accountUtils";

export const useSelectedAccount = () => {
  const pkh = useAppSelector((s) => s.accounts.selected);
  const accounts = useAppSelector((s) => s.accounts.items);

  return pkh === null ? null : accounts.find((a) => a.pkh === pkh);
};

export const useGetAccountBalance = () => {
  const balances = useAppSelector((s) => s.assets.balances);

  return (pkh: string) => {
    return balances[pkh] as balance | undefined; // TODO fix this unsafeness
  };
};

export const useSelectedAccountBalance = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();

  return account && accountBalance(account.pkh);
};

export const useTotalBalance = () => {
  const balances = useAppSelector((s) => s.assets.balances);

  return getTotalBalance(balances);
};

export const useReset = () => {
  const dispatch = useAppDispatch();

  return () => {
    dispatch(accountsSlice.actions.reset());
  };
};
