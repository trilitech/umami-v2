import { Box, Flex, Heading } from "@chakra-ui/react";
import { BsWindowPlus } from "react-icons/bs";
import AccountTile from "../../components/AccountTile";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { Account, AccountType } from "../../types/Account";
import accountsSlice from "../../utils/store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import AccountDisplayDrawer from "./AccountDisplayDrawer";
import { useCreateOrImportSecret } from "./createOrImportSecret/useCreateSecretModal";
import BigNumber from "bignumber.js";

const { setSelected } = accountsSlice.actions;

const Header = () => {
  const { onOpen, modalElement } = useCreateOrImportSecret();
  return (
    <Flex justifyContent={"space-between"} mt={4} mb={4}>
      <Heading size={"lg"}>Accounts</Heading>
      <IconAndTextBtn onClick={onOpen} label="Add/Create" icon={BsWindowPlus} />
      {modalElement}
    </Flex>
  );
};

const AccountGroup: React.FC<{
  accounts: Account[];
  groupLabel: string;
  balances: Record<string, BigNumber | null>;
  onSelect: (pkh: string) => void;
  selected: string | null;
}> = ({ groupLabel, accounts, balances, onSelect, selected }) => {
  return (
    <Box data-testid={`account-group-${groupLabel}`}>
      <Heading size="md">{groupLabel}</Heading>

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

const groupByKind = (accounts: Account[]) => {
  return accounts.reduce((group: Record<string, Account[] | undefined>, a) => {
    const getLabel = (a: Account) => {
      if (a.type === AccountType.MNEMONIC) {
        return `seedphrase ${a.seedFingerPrint.slice(0, 5)}`;
      }
      if (a.type === AccountType.SOCIAL) {
        return "social";
      }

      const error: never = a;
      throw new Error(error);
    };

    const label = getLabel(a);
    group[label] = [...(group[label] || []), a];
    return group;
  }, {});
};

export const AccountsList: React.FC<{ onOpen: () => void }> = (props) => {
  const { items: accounts, selected } = useAppSelector((s) => s.accounts);
  const dispatch = useAppDispatch();

  const balances = useAppSelector((s) => s.assets.balances.tez);

  const accountsByKind = groupByKind(accounts);
  return (
    <Box>
      <Header />
      {Object.entries(accountsByKind).map(([label, accountsByType]) => {
        return accountsByType ? (
          <AccountGroup
            key={label}
            selected={selected}
            accounts={accountsByType}
            balances={balances}
            groupLabel={label}
            onSelect={(pkh: string) => {
              props.onOpen();
              dispatch(setSelected(pkh));
            }}
          />
        ) : null;
      })}
    </Box>
  );
};

const AccountListWithDrawer = () => (
  <AccountDisplayDrawer
    initiator={(onOpen) => <AccountsList onOpen={onOpen} />}
  />
);

export default AccountListWithDrawer;
