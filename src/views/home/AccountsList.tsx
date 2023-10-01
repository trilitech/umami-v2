import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { compact, groupBy } from "lodash";
import { useContext } from "react";
import { BsWindowPlus } from "react-icons/bs";
import KeyIcon from "../../assets/icons/Key";
import { DynamicModalContext } from "../../components/DynamicModal";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import NestedScroll from "../../components/NestedScroll";
import { useOnboardingModal } from "../../components/Onboarding/useOnboardingModal";
import { AccountType, Account } from "../../types/Account";
import {
  useAllAccounts,
  useRemoveMnemonic,
  useRemoveNonMnemonic,
} from "../../utils/hooks/accountHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch, useAppSelector } from "../../utils/redux/hooks";
import { deriveAccount } from "../../utils/redux/thunks/restoreMnemonicAccounts";
import AccountPopover from "./AccountPopover";
import DeriveAccountDisplay from "./DeriveAccountDisplay.tsx";
import { FormPage } from "../../components/SendFlow/MultisigAccount/FormPage";
import { AccountTile } from "../../components/AccountTile/AccountTile";
import colors from "../../style/colors";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const AccountListHeader = () => {
  const { onOpen, modalElement } = useOnboardingModal();
  return (
    <Flex justifyContent="space-between" mt={4} mb={4}>
      <Heading size="lg">Accounts</Heading>
      <IconAndTextBtn onClick={onOpen} label="Add/Create" icon={BsWindowPlus} />
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
  const isMultisig = first.type === AccountType.MULTISIG;
  const isMnemonic = first.type === AccountType.MNEMONIC;
  const { openWith, onClose } = useContext(DynamicModalContext);
  const removeMnemonic = useRemoveMnemonic();
  const removeNonMnemonic = useRemoveNonMnemonic();
  const modalBody = isMnemonic
    ? `Are you sure you want to delete all accounts derived from ${getLabel(first)}?`
    : `Are you sure you want to delete all of your ${getLabel(first)}?`;

  const onDelete = () => {
    openWith(
      <ConfirmationModal
        title="Confirmation"
        buttonLabel="Confirm"
        description={modalBody}
        onSubmit={() => {
          if (isMnemonic) {
            removeMnemonic(first.seedFingerPrint);
          } else {
            removeNonMnemonic(first.type);
          }
          onClose();
        }}
      />
    );
  };

  const onDerive = () => {
    if (!isMnemonic) {
      throw new Error(`Can't derive a non mnemonic account!`);
    }
    openWith(<DeriveAccount onDone={onClose} fingerprint={first.seedFingerPrint} />);
  };

  return (
    <Box data-testid={`account-group-${groupLabel}`}>
      <Flex justifyContent="space-between">
        <Heading size="md" mb={4}>
          {groupLabel}
        </Heading>

        {!isMultisig && (
          <AccountPopover onCreate={isMnemonic ? onDerive : undefined} onDelete={onDelete} />
        )}
      </Flex>

      {accounts.map(account => {
        return (
          <AccountTile
            selected={account.address.pkh === selected}
            onClick={_ => onSelect(account.address.pkh)}
            key={account.address.pkh}
            address={account.address.pkh}
            balance={balances[account.address.pkh]}
          />
        );
      })}
    </Box>
  );
};

const getLabel = (account: Account) => {
  switch (account.type) {
    case AccountType.MNEMONIC:
      return `Seedphrase ${account.seedFingerPrint}`;
    case AccountType.SOCIAL:
      return "Social Accounts";
    case AccountType.LEDGER:
      return "Ledger Accounts";
    case AccountType.MULTISIG:
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

  const accountTiles = Object.entries(accountsByKind).map(([label, accountsByType]) => {
    return (
      <AccountGroup
        key={label}
        selected={selected}
        accounts={accountsByType}
        balances={mutezBalance}
        groupLabel={label}
        onSelect={(pkh: string) => {
          onOpen();
          onSelect(pkh);
        }}
      />
    );
  });
  return (
    <>
      <Box height="100%" mr={0}>
        <NestedScroll>
          {compact(accountTiles)}
          <Button
            onClick={() => openWith(<FormPage />)}
            width="100%"
            bg={colors.black}
            border="1px dashed"
            height="90px"
            variant="outline"
            borderColor={colors.gray[500]}
          >
            <Text display="block" m={5} width="100%" textAlign="center" color={colors.gray[400]}>
              <KeyIcon stroke={colors.gray[450]} mr={1} />
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
    <DeriveAccountDisplay
      subtitle={`Name the new account dervied from seedphrase ${props.fingerprint}`}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
