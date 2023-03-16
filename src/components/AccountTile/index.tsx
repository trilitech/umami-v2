import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";
import React from "react";
import { AccountTileDisplay } from "./AccountTileDisplay";

// TODO remove prop duplication from display component
const AccountTile: React.FC<{
  label: string;
  address: string;
  balance: BigNumber | null;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
}> = ({ address, onClick, balance, selected = false, label }) => {
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
