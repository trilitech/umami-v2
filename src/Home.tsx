import { Button, Grid, GridItem } from "@chakra-ui/react";

import { AccountTile } from "./components/AccountTile";
import accountsSlice from "./utils/store/accountsSlice";
import { useAppDispatch, useAppSelector } from "./utils/store/hooks";

const accountActions = accountsSlice.actions;

export default function Home() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((s) => s.accounts.items);
  const logout = () => {
    dispatch(accountActions.reset());
  };

  return (
    <Grid
      h="800px"
      templateRows="repeat(12, 1fr)"
      templateColumns="repeat(12, 1fr)"
      gap={4}
    >
      <GridItem rowSpan={12} colSpan={2} bg="tomato" />
      <GridItem rowSpan={2} colSpan={10} bg="tomato">
        <Button color="red" onClick={logout}>
          "logout"
        </Button>
      </GridItem>
      <GridItem rowSpan={10} colSpan={5}>
        {accounts.map((a) => (
          <AccountTile address={a.pkh} label="bar" balance={0} />
        ))}
      </GridItem>
      <GridItem rowSpan={5} colSpan={5} bg="pink" />
      <GridItem rowSpan={5} colSpan={5} bg="pink" />
    </Grid>
  );
}
