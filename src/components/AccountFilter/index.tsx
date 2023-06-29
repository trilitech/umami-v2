import { compact } from "lodash";
import { useState } from "react";
import { Address } from "../../types/Address";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { AccountFilterDisplay } from "./AccountFilterDisplay";

export function mapToFilteredArray<T>(map: Record<string, T[] | undefined>, filter: string[]) {
  if (filter.length === 0) {
    return compact(Object.values(map).flat());
  }

  return filter.reduce((acc, curr) => {
    return [...acc, ...(map[curr] || [])];
  }, [] as T[]);
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

  function filter<T>(map: Record<string, T[] | undefined>): T[] {
    return mapToFilteredArray(
      map,
      accountFilter.map(a => a.pkh)
    );
  }

  const filteredAccounts =
    accountFilter.length === 0
      ? accounts
      : accounts.filter(account =>
          accountFilter.some(address => address.pkh === account.address.pkh)
        );

  return { filter, filterElement: el, filteredAccounts };
};
