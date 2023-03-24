import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Account } from "../../types/Account";
import { formatPkh } from "../../utils/format";
import { Identicon } from "../Identicon";

const renderAccount = (account: Account) => (
  <Flex>
    <Identicon address={account.pkh} mr={4} />
    <Box>
      <Text>{account.label}</Text>
      <Text color="umami.gray.600">{formatPkh(account.pkh)}</Text>
    </Box>
  </Flex>
);

export const AccountSelector: React.FC<{
  accounts: Account[];
  onSelect: (a: Account) => void;
  selected?: string;
}> = ({ accounts, onSelect = () => {}, selected }) => {
  const selectedAccount = accounts.find((a) => a.pkh === selected);

  return (
    <Menu>
      <MenuButton
        onChange={(a) => {
          console.log(a.target);
        }}
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
