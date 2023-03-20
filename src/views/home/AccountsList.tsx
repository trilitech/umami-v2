import { Box } from "@chakra-ui/react";
import AccountTile from "../../components/AccountTile";
import { formatPkh } from "../../utils/format";
import accountsSlice from "../../utils/store/accountsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import AccountDisplayDrawer from "./AccountDisplayDrawer";

const { setSelected } = accountsSlice.actions;

const AccountsList: React.FC<{ onOpen: () => void }> = (props) => {
  const { items: accounts, selected } = useAppSelector((s) => s.accounts);
  const dispatch = useAppDispatch();

  const balances = useAppSelector((s) => s.assets.balances);

  return (
    <Box>
      {accounts.map((a) => {
        const balance = balances[a.pkh]?.tez;
        return (
          <AccountTile
            selected={a.pkh === selected}
            onClick={(_) => {
              props.onOpen();
              dispatch(setSelected(a.pkh));
            }}
            key={a.pkh}
            address={formatPkh(a.pkh)}
            label="bar"
            balance={balance}
          />
        );
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
