import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Flex, Menu, MenuButton, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import React from "react";
import { Account } from "../../types/Account";
import { formatPkh } from "../../utils/format";
import AccountListDisplay from "../AccountSelector/AccountListDisplay";
import { BaseAccountFilterProps } from "./types";

export const AccountFilterDisplay: React.FC<
  BaseAccountFilterProps & {
    accounts: Account[];
  }
> = ({ onSelect, onRemove, selected = [], isDisabled, accounts }) => {
  const selectedAccounts = accounts.filter(a => selected.some(s => s.pkh === a.address.pkh));
  const selectableAccounts = accounts.filter(a => !selected.some(s => s.pkh === a.address.pkh));

  return (
    <Flex alignItems="center">
      <Menu>
        <MenuButton
          isDisabled={isDisabled}
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
            onSelect(account.address);
          }}
        />
      </Menu>
      {selectedAccounts.map(account =>
        renderPill(account, () => {
          onRemove(account.address);
        })
      )}
    </Flex>
  );
};

const renderPill = (account: Account, onClose: () => void) => {
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
