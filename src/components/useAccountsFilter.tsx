import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Flex, Menu, MenuButton, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { compact, differenceBy, pick } from "lodash";
import { useState } from "react";
import { Account } from "../types/Account";
import { RawPkh } from "../types/Address";
import { formatPkh } from "../utils/format";
import { useAllAccounts } from "../utils/hooks/accountHooks";
import AccountListDisplay from "./AccountSelector/AccountListDisplay";

export const useAccountsFilter = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
  const allAccounts = useAllAccounts();
  const selectableAccounts = differenceBy(allAccounts, selectedAccounts, acc => acc.address.pkh);
  const alreadySelectedAll = selectedAccounts.length === allAccounts.length;

  return {
    selectedAccounts: selectedAccounts.length === 0 ? allAccounts : selectedAccounts,
    accountsFilter: (
      <Flex alignItems="center">
        <Menu>
          <MenuButton
            isDisabled={alreadySelectedAll}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
            _hover={{ bg: "none" }}
            _active={{ bg: "none" }}
            maxH="26px"
            fontWeight="normal"
            data-testid="account-filter"
            my={4}
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
        {selectedAccounts.map(account => (
          <Pill
            account={account}
            key={account.address.pkh}
            onClose={() => {
              setSelectedAccounts(
                selectedAccounts.filter(a => a.address.pkh !== account.address.pkh)
              );
            }}
          />
        ))}
      </Flex>
    ),
  };
};

export const useAccountsFilterWithMapFilter = () => {
  const { accountsFilter, selectedAccounts } = useAccountsFilter();

  const filterMap = <T,>(assetsByAccount: Record<RawPkh, T[] | undefined>): T[] => {
    return compact(
      Object.values(
        pick(
          assetsByAccount,
          selectedAccounts.map(acc => acc.address.pkh)
        )
      ).flat()
    );
  };

  return {
    filterMap,
    accountsFilter,
  };
};

const Pill: React.FC<{ account: Account; onClose: () => void }> = ({ account, onClose }) => {
  return (
    <Tag
      borderRadius="full"
      bg="#2C2B2B"
      pl="8px"
      pr="8px"
      pt="3px"
      pb="3px"
      mx={1}
      height={4}
      key={account.address.pkh}
      data-testid="account-pill"
    >
      <TagLabel fontSize="14px" lineHeight="18px">
        {account.label ?? formatPkh(account.address.pkh)}
      </TagLabel>
      <TagCloseButton onClick={onClose} data-testid={`account-pill-close-${account.address.pkh}`} />
    </Tag>
  );
};
