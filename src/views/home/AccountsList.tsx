import { Box, Flex, Heading, Modal, ModalContent, useDisclosure, useToast } from "@chakra-ui/react";
import { groupBy } from "lodash";
import { useRef, useState } from "react";
import { BsWindowPlus } from "react-icons/bs";
import AccountTile from "../../components/AccountTile";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import NestedScroll from "../../components/NestedScroll";
import { useOnboardingModal } from "../../components/Onboarding/useOnboardingModal";
import { AccountType, Account } from "../../types/Account";
import { useAllAccounts, useRemoveMnemonic } from "../../utils/hooks/accountHooks";
import { useConfirmation } from "../../utils/hooks/confirmModal";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import { deriveAccount } from "../../utils/store/thunks/restoreMnemonicAccounts";
import AccountPopover from "./AccountPopover";
import DeriveAccountDisplay from "./DeriveAccountDisplay.tsx";

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
}> = props => {
  const selected = props.selected;
  const accounts = useAllAccounts();

  const mutezBalance = useAppSelector(s => s.assets.balances.mutez);

  const accountsByKind = groupBy(accounts, getLabel);

  const {
    onOpen: openConfirmModal,
    element: confirmModal,
    onClose: closeConfirmModal,
  } = useConfirmation();
  const removeMnemonic = useRemoveMnemonic();

  const { element: deriveAccountModal, onOpen: openDeriveAccountModal } = useDeriveAccountModal();

  const accountTiles = Object.entries(accountsByKind).map(([label, accountsByType]) => {
    if (!accountsByType) {
      return null;
    }

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

    return accountsByType ? (
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
          props.onOpen();
          props.onSelect(pkh);
        }}
      />
    ) : null;
  });
  return (
    <Box height="100%">
      <NestedScroll>{accountTiles}</NestedScroll>
      {confirmModal}
      {deriveAccountModal}
    </Box>
  );
};

const DeriveAcount = (props: { onDone: () => void; fingerprint: string }) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsloading] = useState(false);
  const toast = useToast();

  const handleSubmit = async ({ name, password }: { name: string; password: string }) => {
    setIsloading(true);
    try {
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
    } catch (error) {
      toast({
        title: "Failed to derive new account",
        description: (error as Error).message,
      });
    }

    setIsloading(false);
  };

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
            <DeriveAcount onDone={onClose} fingerprint={paramsRef.current.fingerprint} />
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
