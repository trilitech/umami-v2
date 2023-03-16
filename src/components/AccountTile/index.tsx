import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";
import React from "react";
import { AccountTileDisplay, Props } from "./AccountTileDisplay";

const AccountTile: React.FC<
  Omit<Props, "balance"> & {
    balance: BigNumber | null;
  }
> = ({ address, onClick, balance, selected = false, label }) => {
  const prettyBalance = balance && `${format("mutez", "tz", balance)} tez`;
  return (
    <AccountTileDisplay
      selected={selected}
      onClick={onClick}
      address={address}
      balance={prettyBalance}
      label={label}
    />
  );
};

export default AccountTile;
