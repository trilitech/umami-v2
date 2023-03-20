import React from "react";
import BigNumber from "bignumber.js";
import { formatPkh } from "../../utils/format";
import {
  useAccountBalance,
  useSelectedAccount,
  useSelectedAccountBalance,
} from "../../utils/hooks/accountHooks";
import { AccountCardDisplay } from "./AccountCardDisplay";
import { mutezToTez } from "../../utils/store/impureFormat";

export const AccountCard = () => {
  const account = useSelectedAccount();
  const accountBalance = useAccountBalance();

  if (!account) {
    return null;
  }

  const balance = accountBalance(account.pkh);
  const tez = balance ? balance.tez : null;

  return (
    <AccountCardDisplay
      pkh={formatPkh(account.pkh)}
      label="My super account"
      tezBalance={tez && mutezToTez(tez)}
      dollarBalance={4}
    />
  );
};

export default AccountCard;
