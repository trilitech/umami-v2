import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Menu, MenuButton, Wrap } from "@chakra-ui/react";
import { differenceBy } from "lodash";
import { useState } from "react";
import { Account } from "../types/Account";
import { useAllAccounts } from "../utils/hooks/getAccountDataHooks";
import AccountListDisplay from "./AccountSelector/AccountListDisplay";
import AddressPill from "./AddressPill/AddressPill";

export const useAccountsFilter = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
  const allAccounts = useAllAccounts();
  const selectableAccounts = differenceBy(allAccounts, selectedAccounts, acc => acc.address.pkh);
  const alreadySelectedAll = selectedAccounts.length === allAccounts.length;

  return {
    selectedAccounts: selectedAccounts.length === 0 ? allAccounts : selectedAccounts,
    accountsFilter: (
      <Center>
        <Box alignSelf="flex-start">
          <Menu>
            <MenuButton
              as={Button}
              maxHeight="26px"
              paddingLeft={0}
              fontWeight="normal"
              _hover={{ bg: "none" }}
              _active={{ bg: "none" }}
              data-testid="account-filter"
              isDisabled={alreadySelectedAll}
              marginY="16px"
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
            >
              Filter by Account
            </MenuButton>
            <AccountListDisplay
              accounts={selectableAccounts}
              onSelect={account => {
                setSelectedAccounts([...selectedAccounts, account]);
              }}
            />
          </Menu>
        </Box>
        <Wrap width="100%">
          {selectedAccounts.map(account => (
            <AddressPill
              data-testid="account-pill"
              key={account.address.pkh}
              address={account.address}
              mode={{
                type: "removable",
                onRemove: () => {
                  setSelectedAccounts(
                    selectedAccounts.filter(a => a.address.pkh !== account.address.pkh)
                  );
                },
              }}
            />
          ))}
        </Wrap>
      </Center>
    ),
  };
};
