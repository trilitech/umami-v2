import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { ImplicitAccount } from "../../types/Account";
import { useImplicitAccounts } from "../../utils/hooks/accountHooks";
import { AccountSmallTileDisplay } from "./AccountSmallTile";

const renderAccount = (account: ImplicitAccount) => (
  <AccountSmallTileDisplay pkh={account.pkh} label={account.label} />
);

export const ConnectedAccountSelector: React.FC<{
  onSelect: (a: ImplicitAccount) => void;
  selected?: string;
  isDisabled?: boolean;
}> = ({ onSelect = () => {}, selected, isDisabled }) => {
  const accounts = useImplicitAccounts();
  const selectedAccount = accounts.find(a => a.pkh === selected);

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
        {accounts.map(account => (
          <MenuItem
            value={account.pkh}
            aria-label={account.label}
            onClick={e => {
              onSelect(account);
            }}
            key={account.pkh}
            minH="48px"
            w="100%"
            // TODO implement hover color that disapeared
            // https://app.asana.com/0/1204165186238194/1204412123679802/f
            bg={"umami.gray.900"}
          >
            {renderAccount(account)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
