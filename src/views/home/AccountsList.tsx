import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalContent,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { compact, groupBy } from "lodash";
import { useContext, useRef } from "react";
import { BsWindowPlus } from "react-icons/bs";
import KeyIcon from "../../assets/icons/Key";
import AccountTile from "../../components/AccountTile";
import { DynamicModalContext } from "../../components/DynamicModal";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import NestedScroll from "../../components/NestedScroll";
import { useOnboardingModal } from "../../components/Onboarding/useOnboardingModal";
import { AccountType, Account } from "../../types/Account";
import { useAllAccounts, useRemoveMnemonic } from "../../utils/hooks/accountHooks";
import { useConfirmation } from "../../utils/hooks/confirmModal";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch, useAppSelector } from "../../utils/redux/hooks";
import { deriveAccount } from "../../utils/redux/thunks/restoreMnemonicAccounts";
import AccountPopover from "./AccountPopover";
import DeriveAccountDisplay from "./DeriveAccountDisplay.tsx";
import { CreateForm } from "./Multisig/CreateForm";

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
  onDelete?: () => void;
  onDerive: () => void;
  showCTA: boolean;
}> = ({
  groupLabel,
  accounts,
  balances,
  onSelect,
  selected,
  onDelete = () => {},
  onDerive,
  showCTA = false,
}) => {
  return (
    <Box data-testid={`account-group-${groupLabel}`}>
      <Flex justifyContent="space-between">
        <Heading size="md" mb={4}>
          {groupLabel}
        </Heading>

        {showCTA && <AccountPopover onCreate={onDerive} onDelete={onDelete} />}
      </Flex>

      {accounts.map(account => {
        return (
          <AccountTile
            selected={account.address.pkh === selected}
            onClick={_ => {
              onSelect(account.address.pkh);
            }}
            key={account.address.pkh}
            address={account.address.pkh}
            label={account.label}
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

  const {
    onOpen: openConfirmModal,
    element: confirmModal,
    onClose: closeConfirmModal,
  } = useConfirmation();
  const removeMnemonic = useRemoveMnemonic();

  const { element: deriveAccountModal, onOpen: openDeriveAccountModal } = useDeriveAccountModal();

  const accountTiles = Object.entries(accountsByKind).map(([label, accountsByType]) => {
    const first = accountsByType[0];
    const isMnemonicGroup = first.type === AccountType.MNEMONIC;

    const handleDelete = () => {
      if (!isMnemonicGroup) {
        throw new Error(`Can't delete a non mnemonic account group! `);
      }

      openConfirmModal({
        onConfirm: () => {
          removeMnemonic(first.seedFingerPrint);
          closeConfirmModal();
        },
        body: `Are you sure you want to delete all accounts derived from ${label}?`,
      });
    };

    const handleDerive = () => {
      if (!isMnemonicGroup) {
        throw new Error(`Can't derive a non mnemonic account!`);
      }
      openDeriveAccountModal({ fingerprint: first.seedFingerPrint });
    };

    return (
      <AccountGroup
        showCTA={isMnemonicGroup}
        key={label}
        selected={selected}
        accounts={accountsByType}
        balances={mutezBalance}
        groupLabel={label}
        onDelete={handleDelete}
        onDerive={handleDerive}
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
            onClick={() => openWith(<CreateForm />)}
            width="100%"
            bg="umami.black"
            border="1px dashed"
            height="90px"
            borderColor="umami.gray.500"
          >
            <Text display="block" m={5} width="100%" textAlign="center" color="umami.gray.400">
              <KeyIcon stroke="umami.gray.450" mr={1} />
              Create New Multisig
            </Text>
          </Button>
        </NestedScroll>
        {confirmModal}
        {deriveAccountModal}
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

export const useDeriveAccountModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const paramsRef = useRef<{ fingerprint: string }>();

  return {
    element: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent bg="umami.gray.900">
          {paramsRef.current?.fingerprint && (
            <DeriveAccount onDone={onClose} fingerprint={paramsRef.current.fingerprint} />
          )}
        </ModalContent>
      </Modal>
    ),
    onOpen: (params: { fingerprint: string }) => {
      paramsRef.current = params;
      onOpen();
    },
  };
};
