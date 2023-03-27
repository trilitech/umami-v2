import { formatPkh } from "../../utils/format";
import { roundTo } from "../../utils/helpers";
import {
  useGetAccountBalance,
  useSelectedAccount,
} from "../../utils/hooks/accountHooks";
import { useConversionRate } from "../../utils/hooks/assetsHooks";
import { mutezToTez } from "../../utils/store/impureFormat";
import { AccountCardDisplay } from "./AccountCardDisplay";

export const AccountCard = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();
  const rate = useConversionRate();

  if (!account) {
    return null;
  }

  const balance = accountBalance(account.pkh);
  const tezBalance = (balance?.tez && mutezToTez(balance.tez)) || null;
  const dollarBalance = rate && tezBalance && rate * tezBalance;

  return (
    <AccountCardDisplay
      pkh={formatPkh(account.pkh)}
      label={account.label || ""}
      tezBalance={tezBalance}
      dollarBalance={dollarBalance && roundTo(dollarBalance, 2)}
    />
  );
};

export default AccountCard;
