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
import KeyIcon from "../../assets/icons/Key";
import { DynamicModalContext } from "../../components/DynamicModal";
import NestedScroll from "../../components/NestedScroll";
import { useOnboardingModal } from "../../components/Onboarding/useOnboardingModal";
import { Account } from "../../types/Account";
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
import AddAccountIcon from "../../assets/icons/AddAccount";

export const AccountListHeader = () => {
  const { onOpen, modalElement } = useOnboardingModal();
  return (
    <Flex flexDirection="row-reverse" marginBottom="16px" marginTop="12px">
      <Button variant="CTAWithIcon" onClick={onOpen} paddingRight="0">
        <AddAccountIcon stroke="currentcolor" />
        <Text ml="4px" size="sm">
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
  const modalBody = isMnemonic
    ? `Are you sure you want to remove all accounts derived from ${getLabel(first)}?`
    : `Are you sure you want to remove all of your ${getLabel(first)}?`;

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
          <Box mb="16px" key={account.address.pkh}>
            <AccountTile
              selected={account.address.pkh === selected}
              onClick={_ => onSelect(account.address.pkh)}
              address={account.address.pkh}
              balance={balances[account.address.pkh]}
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
    <ModalContent>
      <ModalCloseButton />
      <DeriveAccountDisplay
        subtitle={`Name the new account derived from ${props.fingerprint}`}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </ModalContent>
  );
};
