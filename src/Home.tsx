import { Button, Grid, GridItem } from "@chakra-ui/react";
import SideNavbar from "./components/SideNavbar";

import accountsSlice from "./utils/store/accountsSlice";
import { useAppDispatch } from "./utils/store/hooks";
import { AccountsList } from "./views/home/AccountsList";

import { NftList } from "./views/home/NftList";
import { OperationsList } from "./views/home/OperationsList";
const accountActions = accountsSlice.actions;

export default function Home() {
  const dispatch = useAppDispatch();
  const logout = () => {
    dispatch(accountActions.reset());
  };
  return (
    <Grid
      h="100vh"
      templateRows="repeat(12, 1fr)"
      templateColumns="repeat(12, 1fr)"
      gap={4}
    >
      <GridItem rowSpan={12} colSpan={2} bg="umami.gray.900">
        <SideNavbar />
      </GridItem>
      <GridItem rowSpan={2} colSpan={10} bg="umami.gray.900">
        <Button color="white" onClick={logout}>
          "logout"
        </Button>
      </GridItem>
      <GridItem rowSpan={10} colSpan={5}>
        <AccountsList />
      </GridItem>
      <GridItem rowSpan={5} colSpan={5} bg="umami.gray.900">
        <OperationsList />
      </GridItem>
      <GridItem
        rowSpan={5}
        p={4}
        colSpan={5}
        bg="umami.gray.900"
        overflow="scroll"
      >
        <NftList />
      </GridItem>
    </Grid>
  );
}
