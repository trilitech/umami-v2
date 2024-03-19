import { Box, Flex, Heading } from "@chakra-ui/react";
import { useContext } from "react";

import { AccountGroupPopover } from "./AccountGroupPopover";
import { DeriveMnemonicAccountModal } from "./DeriveMnemonicAccountModal";
import { getAccountGroupLabel } from "./getAccountGroupLabel";
import { AccountTile } from "../../components/AccountTile/AccountTile";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DynamicModalContext } from "../../components/DynamicModal";
import { Account } from "../../types/Account";
import { useImplicitAccounts } from "../../utils/hooks/getAccountDataHooks";
import { useRemoveMnemonic, useRemoveNonMnemonic } from "../../utils/hooks/setAccountDataHooks";

export const AccountGroup: React.FC<{
  accounts: Account[];
  groupLabel: string;
  balances: Record<string, string | undefined>;
}> = ({ groupLabel, accounts, balances }) => {
  const first = accounts[0];
  const isMultisig = first.type === "multisig";
  const isMnemonic = first.type === "mnemonic";
  const { openWith, onClose } = useContext(DynamicModalContext);
  const removeMnemonic = useRemoveMnemonic();
  const removeNonMnemonic = useRemoveNonMnemonic();
  const isLastImplicitAccounts = useImplicitAccounts().length === accounts.length;

  const title = "Remove All Accounts";
  let description: string;
  let buttonLabel = "Remove All";

  const label = getAccountGroupLabel(first);
  if (isLastImplicitAccounts) {
    description =
      "Removing all your accounts will off-board you from Umami. " +
      "This will remove or reset all customized settings to their defaults. " +
      "Personal data (including saved contacts, password and accounts) won't be affected.";
    buttonLabel = "Remove & Off-board";
  } else if (isMnemonic) {
    description = `Are you sure you want to remove all accounts derived from ${label}?`;
  } else {
    description = `Are you sure you want to remove all of your ${label}?`;
  }

  const onRemove = () =>
    openWith(
      <ConfirmationModal
        buttonLabel={buttonLabel}
        description={description}
        onSubmit={() => {
          if (isMnemonic) {
            removeMnemonic(first.seedFingerPrint);
          } else {
            removeNonMnemonic(first.type);
          }
          onClose();
        }}
        title={title}
      />
    );

  const onDerive = () => {
    if (!isMnemonic) {
      throw new Error("Can't derive a non mnemonic account!");
    }
    return openWith(
      <DeriveMnemonicAccountModal fingerPrint={first.seedFingerPrint} onDone={onClose} />
    );
  };

  return (
    <Box data-testid={`account-group-${groupLabel}`}>
      <Flex justifyContent="space-between">
        <Heading marginBottom={4} data-testid="account-group-title" size="md">
          {groupLabel}
        </Heading>

        {!isMultisig && (
          <AccountGroupPopover onCreate={isMnemonic ? onDerive : undefined} onRemove={onRemove} />
        )}
      </Flex>

      {accounts.map(account => (
        <Box key={account.address.pkh} marginBottom="16px">
          <AccountTile account={account} balance={balances[account.address.pkh]} />
        </Box>
      ))}
    </Box>
  );
};
