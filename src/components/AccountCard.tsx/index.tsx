import { useSelectedAccount } from "../../utils/hooks/accountHooks";
import {
  useGetAccountBalance,
  useGetDollarBalance,
} from "../../utils/hooks/assetsHooks";
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
  const tez = balance || null;
  const dollarBalance = getDollarBalance(account.pkh);

  return (
    <AccountCardDisplay
      pkh={account.pkh}
      label={account.label || ""}
      tezBalance={tez && mutezToTez(tez)}
      dollarBalance={dollarBalance}
    />
  );
};

export default AccountCard;
