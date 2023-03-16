import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { MakiLogo } from "./components/MakiLogo";
import NetworkSelector from "./components/NetworkSelector";

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
      h="800px"
      templateRows="repeat(12, 1fr)"
      templateColumns="repeat(12, 1fr)"
      gap={4}
    >
      <GridItem rowSpan={12} colSpan={2} bg="#363636">
        <Flex justifyContent="space-between" alignItems="center" padding={4}>
          <MakiLogo size={50} />
          <NetworkSelector />
        </Flex>
      </GridItem>
      <GridItem rowSpan={2} colSpan={10} bg="#363636">
        <Button color="white" onClick={logout}>
          "logout"
        </Button>
      </GridItem>
      <GridItem rowSpan={10} colSpan={5}>
        <AccountsList />
      </GridItem>
      <GridItem rowSpan={5} colSpan={5} bg="#363636">
        <OperationsList />
      </GridItem>
      <GridItem rowSpan={5} colSpan={5} bg="#363636">
        <NftList />
      </GridItem>
    </Grid>
  );
}
