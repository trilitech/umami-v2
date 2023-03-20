import { balance } from "../store/assetsSlice";
import { useAppSelector } from "../store/hooks";

export const useSelectedAccount = () => {
  const pkh = useAppSelector((s) => s.accounts.selected);
  const accounts = useAppSelector((s) => s.accounts.items);

  return pkh === null ? null : accounts.find((a) => a.pkh === pkh);
};

export const useAccountBalance = () => {
  const balances = useAppSelector((s) => s.assets.balances);

  return (pkh: string) => {
    return balances[pkh] as balance | undefined; // TODO fix this unsafeness
  };
};

export const useSelectedAccountBalance = () => {
  const account = useSelectedAccount();
  const accountBalance = useAccountBalance();

  return account && accountBalance(account.pkh);
};
