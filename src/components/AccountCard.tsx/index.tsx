import {
  useGetAccountBalance,
  useSelectedAccount,
} from "../../utils/hooks/accountHooks";
import { useGetDollarBalance } from "../../utils/hooks/assetsHooks";
import { mutezToTez } from "../../utils/store/impureFormat";
import { AccountCardDisplay } from "./AccountCardDisplay";

export const AccountCard = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();
  const getDollarBalance = useGetDollarBalance();

  if (!account) {
    return null;
  }

  const balance = accountBalance(account.pkh);
  const tez = balance ? balance.tez : null;
  const dollarBalance = getDollarBalance(account.pkh);

  return (
    <AccountCardDisplay
      pkh={account.pkh}
      label={account.label || ""}
      tezBalance={tez && mutezToTez(tez)}
      dollarBalance={dollarBalance}
      onCopyAddress={(pkh: string) => {
        navigator.clipboard.writeText(pkh);
      }}
    />
  );
};

export default AccountCard;
