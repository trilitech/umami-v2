import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalContent,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsWindowPlus } from "react-icons/bs";
import AccountTile from "../../components/AccountTile";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { useCreateOrImportSecretModal } from "../../components/Onboarding/useOnboardingModal";
import {
  Account,
  AccountType,
  LedgerAccount,
  MnemonicAccount,
  SocialAccount,
} from "../../types/Account";
import { useRemoveMnemonic } from "../../utils/hooks/accountHooks";
import { useConfirmation } from "../../utils/hooks/confirmModal";
import accountsSlice from "../../utils/store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import { deriveAccount } from "../../utils/store/thunks/restoreMnemonicAccounts";
import AccountDisplayDrawer from "./AccountDisplayDrawer";
import AccountPopover from "./AccountPopover";
import DeriveAccountDisplay from "./DeriveAccountDisplay.tsx";

const { setSelected } = accountsSlice.actions;

type AccountsOfSameType = MnemonicAccount[] | LedgerAccount[] | SocialAccount[];

type GroupedByLabel = Record<string, AccountsOfSameType | undefined>;

const Header = () => {
  const { onOpen, modalElement } = useCreateOrImportSecretModal();
  return (
    <Flex justifyContent={"space-between"} mt={4} mb={4}>
      <Heading size={"lg"}>Accounts</Heading>
      <IconAndTextBtn onClick={onOpen} label="Add/Create" icon={BsWindowPlus} />
      {modalElement}
    </Flex>
  );
};

const AccountGroup: React.FC<{
  accounts: AccountsOfSameType;
  groupLabel: string;
  balances: Record<string, string | null | undefined>;
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
      <Flex justifyContent={"space-between"}>
        <Heading size="md" mb={4}>
          {groupLabel}
        </Heading>

        {showCTA && <AccountPopover onCreate={onDerive} onDelete={onDelete} />}
      </Flex>

      {accounts.map((a) => {
        const balance = balances[a.pkh];
        return (
          <AccountTile
            selected={a.pkh === selected}
            onClick={(_) => {
              onSelect(a.pkh);
            }}
            key={a.pkh}
            address={a.pkh}
            label={a.label || ""}
            balance={balance ?? null}
          />
        );
      })}
    </Box>
  );
};

const getLabel = (a: Account) => {
  switch (a.type) {
    case AccountType.MNEMONIC:
      return `Seedphrase ${a.seedFingerPrint}`;
    case AccountType.SOCIAL:
      return "Social Accounts";
    case AccountType.LEDGER:
      return "Ledger Accounts";
    default: {
      const error: never = a;
      throw new Error(error);
    }
  }
};
const groupByKind = (accounts: Account[]): GroupedByLabel => {
  return accounts.reduce((group: GroupedByLabel, a) => {
    const label = getLabel(a);

    const existing = group[label] || [];
    switch (a.type) {
      case AccountType.MNEMONIC:
        group[label] = [...(existing as MnemonicAccount[]), a];
        break;
      case AccountType.LEDGER:
        group[label] = [...(existing as LedgerAccount[]), a];
        break;
      case AccountType.SOCIAL:
        group[label] = [...(existing as SocialAccount[]), a];
        break;
      default: {
        const error: never = a;
        throw error;
      }
    }

    return group;
  }, {});
};

export const AccountsList: React.FC<{ onOpen: () => void }> = (props) => {
  const { items: accounts, selected } = useAppSelector((s) => s.accounts);
  const dispatch = useAppDispatch();

  const balances = useAppSelector((s) => s.assets.balances.tez);

  const accountsByKind = groupByKind(accounts);

  const { onOpen, element, onClose } = useConfirmation();
  const removeMnemonic = useRemoveMnemonic();

  const { element: deriveElement, onOpen: openDeriveAccount } =
    useDeriveAccountModal();

  return (
    <Box>
      <Header />
      {Object.entries(accountsByKind).map(([label, accountsByType]) => {
        if (!accountsByType) {
          return null;
        }

        const first = accountsByType[0];
        const isMnemonicGroup = first.type === AccountType.MNEMONIC;

        const handleDelete = () => {
          if (!isMnemonicGroup) {
            throw new Error(`Can't delete a non mnemonic account group! `);
          }

          onOpen({
            onConfirm: () => {
              removeMnemonic(first.seedFingerPrint);
              onClose();
            },
            body: `Are you sure you want to delete all accounts derived from ${label}?`,
          });
        };

        const handleDerive = () => {
          if (!isMnemonicGroup) {
            throw new Error(`Can't derive a non mnemonic account!`);
          }
          openDeriveAccount({ fingerprint: first.seedFingerPrint });
        };

        return accountsByType ? (
          <AccountGroup
            showCTA={isMnemonicGroup}
            key={label}
            selected={selected}
            accounts={accountsByType}
            balances={balances}
            groupLabel={label}
            onDelete={handleDelete}
            onDerive={handleDerive}
            onSelect={(pkh: string) => {
              props.onOpen();
              dispatch(setSelected(pkh));
            }}
          />
        ) : null;
      })}
      {element}
      {deriveElement}
    </Box>
  );
};

const AccountListWithDrawer = () => (
  <AccountDisplayDrawer
    initiator={(onOpen) => <AccountsList onOpen={onOpen} />}
  />
);

const DeriveAcount = (props: { onDone: () => void; fingerprint: string }) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsloading] = useState(false);
  const toast = useToast();

  const handleSubmit = async ({
    name,
    password,
  }: {
    name: string;
    password: string;
  }) => {
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
            <DeriveAcount
              onDone={onClose}
              fingerprint={paramsRef.current.fingerprint}
            />
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

export default AccountListWithDrawer;
