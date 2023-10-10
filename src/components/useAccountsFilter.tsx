import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Menu, MenuButton, Wrap } from "@chakra-ui/react";
import { differenceBy } from "lodash";
import { useState } from "react";
import { Account } from "../types/Account";
import { useAllAccounts } from "../utils/hooks/accountHooks";
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
      <Box>
        <Menu>
          <MenuButton
            isDisabled={alreadySelectedAll}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
            _hover={{ bg: "none" }}
            _active={{ bg: "none" }}
            maxH="26px"
            pl={0}
            fontWeight="normal"
            data-testid="account-filter"
            my="16px"
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
        <Wrap p="8px" width="90%">
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
              mr="8px"
            />
          ))}
        </Wrap>
      </Box>
    ),
  };
};
