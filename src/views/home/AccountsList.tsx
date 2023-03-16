import React from "react";
import { AccountTile } from "../../components/AccountTile";
import accountsSlice from "../../utils/store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import { formatPkh } from "../../utils/tezos";

const { setSelected } = accountsSlice.actions;
export const AccountsList = () => {
  const { items: accounts, selected } = useAppSelector((s) => s.accounts);
  const dispatch = useAppDispatch();

  const balances = useAppSelector((s) => s.assets.balances);

  return (
    <div>
      {accounts.map((a) => {
        const balance = balances[a.pkh]?.tez;
        return (
          <AccountTile
            selected={a.pkh === selected}
            onClick={(_) => dispatch(setSelected(a.pkh))}
            key={a.pkh}
            address={formatPkh(a.pkh)}
            label="bar"
            balance={balance}
          />
        );
      })}
    </div>
  );
};
