import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { Account } from "../../types/Account";
import { useAccounts } from "../../utils/hooks/accountHooks";
import { AccountSmallTile } from "./AccountSmallTile";

const renderAccount = (account: Account) => (
  <AccountSmallTile pkh={account.pkh} label={account.label} />
);

export const AccountSelector: React.FC<{
  accounts: Account[];
  onSelect: (a: Account) => void;
  selected?: string;
  isDisabled?: boolean;
}> = ({ accounts, onSelect = () => {}, selected, isDisabled }) => {
  const selectedAccount = accounts.find((a) => a.pkh === selected);

  return (
    <Menu>
      <MenuButton
        isDisabled={isDisabled}
        data-testid="account-selector"
        w={"100%"}
        textAlign="left"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        h={16}
      >
        {selectedAccount ? renderAccount(selectedAccount) : "Select an account"}
      </MenuButton>
      <MenuList bg={"umami.gray.900"}>
        {accounts.map((account) => (
          // TODO refactor with AccountTile in home
          <MenuItem
            onClick={(e) => {
              onSelect(account);
            }}
            key={account.pkh}
            minH="48px"
            w="100%"
            // TODO implement hover color that disapeared
            bg={"umami.gray.900"}
          >
            {renderAccount(account)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export const ConnectedAccountSelector: React.FC<{
  onSelect: (a: Account) => void;
  selected?: string;
  isDisabled?: boolean;
}> = ({ onSelect = () => {}, selected, isDisabled }) => {
  let accounts = useAccounts();
  const selectedAccount = accounts.find((a) => a.pkh === selected);

  return (
    <Menu>
      <MenuButton
        isDisabled={isDisabled}
        data-testid="account-selector"
        w={"100%"}
        textAlign="left"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        h={16}
      >
        {selectedAccount ? renderAccount(selectedAccount) : "Select an account"}
      </MenuButton>
      <MenuList bg={"umami.gray.900"}>
        {accounts.map((account) => (
          // TODO refactor with AccountTile in home
          <MenuItem
            value={account.pkh}
            aria-label={account.label}
            onClick={(e) => {
              onSelect(account);
            }}
            key={account.pkh}
            minH="48px"
            w="100%"
            // TODO implement hover color that disapeared
            bg={"umami.gray.900"}
          >
            {renderAccount(account)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
