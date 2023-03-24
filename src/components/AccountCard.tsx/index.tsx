import { formatPkh } from "../../utils/format";
import {
  useGetAccountBalance,
  useSelectedAccount,
} from "../../utils/hooks/accountHooks";
import { mutezToTez } from "../../utils/store/impureFormat";
import { AccountCardDisplay } from "./AccountCardDisplay";

export const AccountCard = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();

  if (!account) {
    return null;
  }

  const balance = accountBalance(account.pkh);
  const tez = balance ? balance.tez : null;

  return (
    <AccountCardDisplay
      pkh={formatPkh(account.pkh)}
      label={account.label || ""}
      tezBalance={tez && mutezToTez(tez)}
      dollarBalance={4}
    />
  );
};

export default AccountCard;
