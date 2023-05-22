import { Box, Flex, Heading } from "@chakra-ui/react";
import { BsWindowPlus } from "react-icons/bs";
import AccountTile from "../../components/AccountTile";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import {
  Account,
  AccountType,
  LedgerAccount,
  MnemonicAccount,
  SocialAccount,
} from "../../types/Account";
import accountsSlice from "../../utils/store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import AccountDisplayDrawer from "./AccountDisplayDrawer";
import BigNumber from "bignumber.js";
import { useCreateOrImportSecretModal } from "../../components/Onboarding/useOnboardingModal";
import AccountPopover from "./AccountPopover";
import { useConfirmation } from "../../utils/hooks/confirmModal";
import { useRemoveMnemonic } from "../../utils/hooks/accountHooks";

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
  balances: Record<string, BigNumber | null>;
  onSelect: (pkh: string) => void;
  selected: string | null;
  onDelete?: (groupLabel: string) => void;
  showCTA: boolean;
}> = ({
  groupLabel,
  accounts,
  balances,
  onSelect,
  selected,
  onDelete = () => {},
  showCTA = false,
}) => {
  return (
    <Box data-testid={`account-group-${groupLabel}`}>
      <Flex justifyContent={"space-between"}>
        <Heading size="md" mb={4}>
          {groupLabel}
        </Heading>

        {showCTA && (
          <AccountPopover
            onCreate={() => {}}
            onDelete={() => onDelete(groupLabel)}
          />
        )}
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
            balance={balance}
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
            return;
          }

          onOpen({
            onConfirm: () => {
              removeMnemonic(first.seedFingerPrint);
              onClose();
            },
            body: `Are you sure you want to delete all accounts derived from ${label}?`,
          });
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
            onSelect={(pkh: string) => {
              props.onOpen();
              dispatch(setSelected(pkh));
            }}
          />
        ) : null;
      })}
      {element}
    </Box>
  );
};

const AccountListWithDrawer = () => (
  <AccountDisplayDrawer
    initiator={(onOpen) => <AccountsList onOpen={onOpen} />}
  />
);

export default AccountListWithDrawer;
