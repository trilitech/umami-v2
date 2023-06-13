import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { AllAccount } from "../../types/Account";
import { AccountSmallTileDisplay } from "./AccountSmallTile";

const renderAccount = (account: AllAccount) => (
  <AccountSmallTileDisplay pkh={account.pkh} label={account.label} />
);

const AccountSelectorDisplay: React.FC<{
  isDisabled?: boolean;
  selected?: string;
  accounts: AllAccount[];
  onSelect: (a: AllAccount) => void;
  dataTestid?: string;
}> = ({
  isDisabled,
  selected,
  accounts,
  onSelect,
  dataTestid = "account-selector",
}) => {
  const selectedAccount = accounts.find((a) => a.pkh === selected);
  return (
    <Menu>
      <MenuButton
        isDisabled={isDisabled}
        data-testid={dataTestid}
        w={"100%"}
        textAlign="left"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        h={16}
      >
        {selectedAccount ? renderAccount(selectedAccount) : "Select an account"}
      </MenuButton>
      <MenuList bg={"umami.gray.900"} maxHeight={300} overflow="scroll">
        {accounts.map((account) => (
          <MenuItem
            value={account.pkh}
            aria-label={account.label}
            onClick={() => {
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

export default AccountSelectorDisplay;
