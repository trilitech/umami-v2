import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Menu, MenuButton, Wrap } from "@chakra-ui/react";
import { differenceBy } from "lodash";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AccountListDisplay } from "./AccountSelector/AccountListDisplay";
import { AddressPill } from "./AddressPill/AddressPill";
import { Account } from "../types/Account";
import { useAllAccounts } from "../utils/hooks/getAccountDataHooks";

export const useAccountsFilter = () => {
  const allAccounts = useAllAccounts();
  // since useAllAccounts always keeps creating new array objects
  // it's needed to ensure that we always return the same object
  const [cachedAllAccounts] = useState(allAccounts);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedAddresses = searchParams.getAll("accounts");
  const [isEmpty, setIsEmpty] = useState(selectedAddresses.length === 0);
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>(
    allAccounts.filter(acc => selectedAddresses.includes(acc.address.pkh))
  );
  const selectableAccounts = differenceBy(allAccounts, selectedAccounts, acc => acc.address.pkh);
  const alreadySelectedAll = selectedAccounts.length === allAccounts.length;

  useEffect(() => {
    setSearchParams(searchParams => ({
      ...searchParams,
      accounts: selectedAccounts.map(acc => acc.address.pkh),
    }));
  }, [selectedAccounts, setSearchParams]);

  return {
    selectedAccounts: isEmpty ? cachedAllAccounts : selectedAccounts,
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
                setIsEmpty(false);
                setSelectedAccounts(accounts => [...accounts, account]);
              }}
            />
          </Menu>
        </Box>
        <Wrap width="100%">
          {selectedAccounts.map(account => (
            <AddressPill
              key={account.address.pkh}
              address={account.address}
              data-testid="account-pill"
              mode={{
                type: "removable",
                onRemove: () => {
                  // it's about to get empty
                  setIsEmpty(selectedAccounts.length === 1);
                  setSelectedAccounts(accounts =>
                    accounts.filter(acc => acc.address.pkh !== account.address.pkh)
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
