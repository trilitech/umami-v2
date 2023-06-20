import React from "react";
import { Account } from "../../types/Account";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import AccountSelectorDisplay from "./AccountSelectorDisplay";

export const ConnectedAccountSelector: React.FC<{
  onSelect: (a: Account) => void;
  selected?: string;
  isDisabled?: boolean;
}> = ({ onSelect = () => {}, selected, isDisabled }) => {
  const accounts = useAllAccounts();

  return (
    <AccountSelectorDisplay
      onSelect={onSelect}
      accounts={accounts}
      selected={selected}
      isDisabled={isDisabled}
    />
  );
};
