import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton } from "@chakra-ui/react";
import React from "react";
import { Account } from "../../types/Account";
import AccountListDisplay from "./AccountListDisplay";
import { AccountSmallTileDisplay } from "./AccountSmallTile";

const renderAccount = (account: Account) => (
  <AccountSmallTileDisplay pkh={account.address.pkh} label={account.label} />
);

const AccountSelectorDisplay: React.FC<{
  isDisabled?: boolean;
  selected?: string;
  accounts: Account[];
  onSelect: (a: Account) => void;
  dataTestid?: string;
}> = ({ isDisabled, selected, accounts, onSelect, dataTestid = "account-selector" }) => {
  const selectedAccount = accounts.find(a => a.address.pkh === selected);
  return (
    <Menu>
      <MenuButton
        isDisabled={isDisabled}
        data-testid={dataTestid}
        w="100%"
        textAlign="left"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        h={16}
      >
        {selectedAccount ? renderAccount(selectedAccount) : "Select an account"}
      </MenuButton>
      <AccountListDisplay accounts={accounts} onSelect={onSelect} />
    </Menu>
  );
};

export default AccountSelectorDisplay;
