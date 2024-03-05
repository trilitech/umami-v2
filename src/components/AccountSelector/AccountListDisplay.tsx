import { MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";

import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { AddressTile } from "../AddressTile/AddressTile";

export const AccountListDisplay: React.FC<{
  accounts: Account[];
  onSelect: (account: Account) => void;
}> = ({ accounts, onSelect }) => (
  <MenuList
    zIndex="docked"
    overflowY="scroll"
    maxHeight="300px"
    padding={0}
    background={colors.gray[900]}
  >
    {accounts.map(account => (
      <MenuItem
        key={account.address.pkh}
        width="100%"
        minHeight="48px"
        padding="5px"
        background={colors.gray[700]}
        aria-label={account.label}
        onClick={() => {
          onSelect(account);
        }}
        // TODO implement hover color that disappeared
        // https://app.asana.com/0/1204165186238194/1204412123679802/f
        value={account.address.pkh}
      >
        <AddressTile
          width="370px"
          height="40px"
          padding="5px"
          background={colors.gray[700]}
          borderRadius="4px"
          _hover={{
            background: colors.gray[500],
          }}
          cursor="pointer"
          address={account.address}
        />
      </MenuItem>
    ))}
  </MenuList>
);
