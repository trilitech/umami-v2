import { MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { AccountSmallTileDisplay } from "./AccountSmallTileDisplay";

export const AccountListDisplay: React.FC<{
  accounts: Account[];
  onSelect: (account: Account) => void;
}> = ({ accounts, onSelect }) => {
  return (
    <MenuList bg="umami.gray.900" maxHeight={300} overflow="scroll" zIndex="docked">
      {accounts.map(account => {
        return (
          <MenuItem
            value={account.address.pkh}
            aria-label={account.label}
            onClick={() => {
              onSelect(account);
            }}
            key={account.address.pkh}
            minH="48px"
            w="100%"
            // TODO implement hover color that disapeared
            // https://app.asana.com/0/1204165186238194/1204412123679802/f
            bg="umami.gray.900"
          >
            {renderAccount(account)}
          </MenuItem>
        );
      })}
    </MenuList>
  );
};

const renderAccount = (account: Account) => (
  <AccountSmallTileDisplay
    _hover={{
      background: colors.gray[600],
    }}
    pkh={account.address.pkh}
    label={account.label}
  />
);
export default AccountListDisplay;
