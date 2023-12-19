import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Menu, MenuButton, Wrap } from "@chakra-ui/react";
import { differenceBy } from "lodash";
import { useSearchParams } from "react-router-dom";

import { AccountListDisplay } from "./AccountSelector/AccountListDisplay";
import { AddressPill } from "./AddressPill/AddressPill";
import { RawPkh } from "../types/Address";
import { useAllAccounts } from "../utils/hooks/getAccountDataHooks";

export const useAccountsFilter = () => {
  const allAccounts = useAllAccounts();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedAddresses = searchParams.getAll("accounts") as RawPkh[];

  const selectedAccounts = allAccounts.filter(acc => selectedAddresses.includes(acc.address.pkh));
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
                setSearchParams({
                  ...searchParams,
                  accounts: [...selectedAccounts, account].map(a => a.address.pkh),
                });
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
                  setSearchParams({
                    ...searchParams,
                    accounts: selectedAddresses.filter(a => a !== account.address.pkh),
                  });
                },
              }}
            />
          ))}
        </Wrap>
      </Center>
    ),
  };
};
