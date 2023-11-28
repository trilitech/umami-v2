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
import { useRemoveMnemonic, useRemoveNonMnemonic } from "../../utils/hooks/setAccountDataHooks";
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
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";

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
        <Heading marginBottom={4} size="md">
          {groupLabel}
        </Heading>

        {!isMultisig && (
          <AccountPopover onCreate={isMnemonic ? onDerive : undefined} onDelete={onDelete} />
        )}
      </Flex>

      {accounts.map(account => {
        return (
          <Box key={account.address.pkh} marginBottom="16px">
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

  const accountTiles = Object.entries(accountsByKind).map(([accountGroupLabel, accountsByType]) => {
    return (
      <AccountGroup
        key={accountGroupLabel}
        selected={selected}
        accounts={accountsByType}
        balances={mutezBalance}
        groupLabel={accountGroupLabel}
        onSelect={(pkh: string) => {
          onOpen();
          onSelect(pkh);
        }}
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
