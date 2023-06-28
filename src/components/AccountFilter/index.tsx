import { compact } from "lodash";
import React, { useState } from "react";
import { Address } from "../../types/Address";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { AccountFilterDisplay } from "./AccountFilterDisplay";
import { BaseAccountFilterProps } from "./types";

export function mapToFilteredArray<T>(map: Record<string, T[] | undefined>, filter: string[]) {
  if (filter.length === 0) {
    return compact(Object.values(map).flat());
  }

  return filter.reduce((acc, curr) => {
    return [...acc, ...(map[curr] || [])];
  }, [] as T[]);
}

const ConnectedAccountFilter: React.FC<BaseAccountFilterProps> = props => {
  const accounts = useAllAccounts();
  return <AccountFilterDisplay accounts={accounts} {...props} />;
};

export const useAccountFilter = () => {
  const [accountFilter, setAccountFilter] = useState<Address[]>([]);

  const el = (
    <ConnectedAccountFilter
      selected={accountFilter}
      onRemove={address => {
        setAccountFilter(accountFilter.filter(a => a.pkh !== address.pkh));
      }}
      onSelect={pkh => {
        setAccountFilter(prev => [...prev, pkh]);
      }}
    />
  );

  function filter<T>(map: Record<string, T[] | undefined>): T[] {
    return mapToFilteredArray(
      map,
      accountFilter.map(a => a.pkh)
    );
  }

  return { filter, filterElement: el };
};

export default ConnectedAccountFilter;
