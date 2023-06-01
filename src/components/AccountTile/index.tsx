import { format } from "@taquito/utils";
import React from "react";
import { AccountTileDisplay, Props } from "./AccountTileDisplay";

const AccountTile: React.FC<
  Omit<Props, "balance"> & {
    balance: string | undefined;
  }
> = ({ address, onClick, balance, selected = false, label }) => {
  const prettyBalance = balance && `${format("mutez", "tz", balance)} ꜩ`;
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
