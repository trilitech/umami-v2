import {
  Box,
  Button,
  Flex,
  Heading,
  ModalCloseButton,
  ModalContent,
  Text,
  useToast,
} from "@chakra-ui/react";
import { compact, groupBy } from "lodash";
import { useContext } from "react";

import { AccountGroupPopover } from "./AccountGroupPopover";
import { DeriveAccountDisplay } from "./DeriveAccountDisplay.tsx";
import { AddAccountIcon, KeyIcon } from "../../assets/icons";
import { AccountTile } from "../../components/AccountTile/AccountTile";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DynamicModalContext } from "../../components/DynamicModal";
import { NestedScroll } from "../../components/NestedScroll";
import { useOnboardingModal } from "../../components/Onboarding/useOnboardingModal";
import { FormPage } from "../../components/SendFlow/MultisigAccount/FormPage";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { useAllAccounts, useImplicitAccounts } from "../../utils/hooks/getAccountDataHooks";
import { useRemoveMnemonic, useRemoveNonMnemonic } from "../../utils/hooks/setAccountDataHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch, useAppSelector } from "../../utils/redux/hooks";
import { deriveAccount } from "../../utils/redux/thunks/restoreMnemonicAccounts";

export const AccountListHeader = () => {
  const { onOpen, modalElement } = useOnboardingModal();
  return (
    <Flex flexDirection="row-reverse" marginTop="12px" marginBottom="16px">
      <Button paddingRight="0" onClick={onOpen} variant="CTAWithIcon">
        <AddAccountIcon stroke="currentcolor" />
        <Text marginLeft="4px" size="sm">
          Add Account
        </Text>
      </Button>
      {modalElement}
    </Flex>
  );
};

const AccountGroup: React.FC<{
  accounts: Account[];
  groupLabel: string;
  balances: Record<string, string | undefined>;
  onSelect: (pkh: string) => void;
  selected: string | null;
}> = ({ groupLabel, accounts, balances, onSelect, selected }) => {
  const first = accounts[0];
  const isMultisig = first.type === "multisig";
  const isMnemonic = first.type === "mnemonic";
  const { openWith, onClose } = useContext(DynamicModalContext);
  const removeMnemonic = useRemoveMnemonic();
  const removeNonMnemonic = useRemoveNonMnemonic();
  const isLastImplicitAccounts = useImplicitAccounts().length === accounts.length;

  let title = "Confirmation",
    description: string,
    buttonLabel = "Confirm";

  const label = getLabel(first);
  if (isLastImplicitAccounts) {
    title = "Are you sure?";
    buttonLabel = "Remove & Off-board";
    description =
      "Removing your last account will off-board your from Umami. This will remove or reset all customised settings to their defaults. Personal data -including saved contacts, password and accounts- won't be affected.";
  } else if (isMnemonic) {
    description = `Are you sure you want to remove all accounts derived from ${label}?`;
  } else {
    description = `Are you sure you want to remove all of your ${label}?`;
  }

  const onRemove = () => {
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
  };

  const onDerive = () => {
    if (!isMnemonic) {
      throw new Error("Can't derive a non mnemonic account!");
    }
    openWith(<DeriveAccount fingerprint={first.seedFingerPrint} onDone={onClose} />);
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

      {accounts.map(account => {
        return (
          <Box key={account.address.pkh} marginBottom="16px">
            <AccountTile
              address={account.address.pkh}
              balance={balances[account.address.pkh]}
              onClick={_ => onSelect(account.address.pkh)}
              selected={account.address.pkh === selected}
            />
          </Box>
        );
      })}
    </Box>
  );
};

const getLabel = (account: Account) => {
  switch (account.type) {
    case "mnemonic":
      return `Seedphrase ${account.seedFingerPrint}`;
    case "social":
      return "Social Accounts";
    case "ledger":
      return "Ledger Accounts";
    case "secret_key":
      return "Secret Key Accounts";
    case "multisig":
      return "Multisig Accounts";
  }
};

export const AccountsList: React.FC<{
  onOpen: () => void;
  selected: string | null;
  onSelect: (pkh: string) => void;
}> = ({ onOpen, selected, onSelect }) => {
  const accounts = useAllAccounts();
  const mutezBalance = useAppSelector(s => s.assets.balances.mutez);
  const accountsByKind = groupBy(accounts, getLabel);
  const { openWith } = useContext(DynamicModalContext);

  const accountTiles = Object.entries(accountsByKind).map(([accountGroupLabel, accountsByType]) => {
    return (
      <AccountGroup
        key={accountGroupLabel}
        accounts={accountsByType}
        balances={mutezBalance}
        groupLabel={accountGroupLabel}
        onSelect={(pkh: string) => {
          onOpen();
          onSelect(pkh);
        }}
        selected={selected}
      />
    );
  });

  return (
    <>
      <Box height="100%" marginRight={0}>
        <NestedScroll>
          {compact(accountTiles)}
          <Button
            width="100%"
            height="90px"
            background={colors.black}
            border="1px dashed"
            borderColor={colors.gray[500]}
            onClick={() => openWith(<FormPage />)}
            variant="outline"
          >
            <Text
              display="block"
              width="100%"
              margin={5}
              color={colors.gray[400]}
              textAlign="center"
            >
              <KeyIcon marginRight={1} stroke={colors.gray[450]} />
              Create New Multisig
            </Text>
          </Button>
        </NestedScroll>
      </Box>
    </>
  );
};

const DeriveAccount = (props: { onDone: () => void; fingerprint: string }) => {
  const dispatch = useAppDispatch();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const toast = useToast();

  const handleSubmit = ({ name, password }: { name: string; password: string }) =>
    handleAsyncAction(
      async () => {
        await dispatch(
          deriveAccount({
            fingerPrint: props.fingerprint,
            password,
            label: name,
          })
        ).unwrap();
        props.onDone();

        toast({
          title: "New account created!",
          description: `Successfully derived account from ${props.fingerprint}`,
        });
      },
      { title: "Failed to derive new account" }
    );

  return (
    <ModalContent>
      <ModalCloseButton />
      <DeriveAccountDisplay
        isLoading={isLoading}
        onSubmit={handleSubmit}
        subtitle={`Name the new account derived from ${props.fingerprint}`}
      />
    </ModalContent>
  );
};
