import { MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import AddressTile from "../AddressTile/AddressTile";

export const AccountListDisplay: React.FC<{
  accounts: Account[];
  onSelect: (account: Account) => void;
}> = ({ accounts, onSelect }) => {
  return (
    <MenuList bg={colors.gray[900]} maxHeight="300px" p={0} overflowY="scroll" zIndex="docked">
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
            padding="5px"
            // TODO implement hover color that disappeared
            // https://app.asana.com/0/1204165186238194/1204412123679802/f
            bg={colors.gray[700]}
          >
            <AddressTile
              cursor="pointer"
              address={account.address}
              _hover={{
                background: colors.gray[500],
              }}
              background={colors.gray[700]}
              width="370px"
              borderRadius="4px"
              padding="5px"
              height="40px"
            />
          </MenuItem>
        );
      })}
    </MenuList>
  );
};

export default AccountListDisplay;
