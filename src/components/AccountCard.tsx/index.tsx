import { round } from "lodash";
import { formatPkh } from "../../utils/format";
import {
  useGetAccountBalance,
  useSelectedAccount,
} from "../../utils/hooks/accountHooks";
import { useTezToDollar } from "../../utils/hooks/assetsHooks";
import { mutezToTez } from "../../utils/store/impureFormat";
import { AccountCardDisplay } from "./AccountCardDisplay";

export const AccountCard = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();
  const tezToDollar = useTezToDollar();

  if (!account) {
    return null;
  }

  const balance = accountBalance(account.pkh);
  const tezBalance = (balance?.tez && mutezToTez(balance.tez)) || null;
  const dollarBalance =
    tezBalance !== null && tezToDollar !== null && tezToDollar(tezBalance);

  return (
    <AccountCardDisplay
      pkh={formatPkh(account.pkh)}
      label={account.label || ""}
      tezBalance={tezBalance}
      dollarBalance={
        dollarBalance || dollarBalance === 0 ? round(dollarBalance, 2) : null
      }
    />
  );
};

export default AccountCard;
