import { compact, flatMap } from "lodash";
import { useState } from "react";
import { Address } from "../../types/Address";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { AccountFilterDisplay } from "./AccountFilterDisplay";

export function mapToFilteredArray<T>(map: Record<string, T[] | undefined>, filter: string[]) {
  return filter.length === 0
    ? compact(Object.values(map).flat())
    : flatMap(filter, account => map[account] || []);
}

export const useAccountFilter = () => {
  const [accountFilter, setAccountFilter] = useState<Address[]>([]);
  const accounts = useAllAccounts();

  const el = (
    <AccountFilterDisplay
      accounts={accounts}
      selected={accountFilter}
      onRemove={address => {
        setAccountFilter(accountFilter.filter(a => a.pkh !== address.pkh));
      }}
      onSelect={pkh => {
        setAccountFilter(prev => [...prev, pkh]);
      }}
    />
  );

  return {
    filterElement: el,
    accountFilter,
  };
};

export const useAccountFilterWithMapFilter = () => {
  const { filterElement, accountFilter } = useAccountFilter();

  function filterMap<T>(map: Record<string, T[] | undefined>): T[] {
    return mapToFilteredArray(
      map,
      accountFilter.map(a => a.pkh)
    );
  }

  return {
    filterMap,
    filterElement,
  };
};
