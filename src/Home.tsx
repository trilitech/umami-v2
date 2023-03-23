import { Grid, GridItem } from "@chakra-ui/react";
import { TopBar } from "./components/TopBar";

import AccountListWithDrawer from "./views/home/AccountsList";

import { NftList } from "./views/home/NftList";
import { OperationsList } from "./views/home/OperationsList";

export default function Home() {
  return (
    <Grid
      height={"100%"}
      templateAreas={`
                  "header header"
                  "main rightTop"
                  "main rightBottom"
                  `}
      gridTemplateRows={"0fr 1fr 1fr"}
      gridTemplateColumns={"1fr 1fr"}
    >
      <GridItem area={"header"}>
        <TopBar title="Overview" />
      </GridItem>
      <GridItem area={"main"} mr={2} mt={4}>
        <AccountListWithDrawer />
      </GridItem>
      <GridItem area={"rightTop"} ml={2} mt={4}>
        <OperationsList />
      </GridItem>
      <GridItem area={"rightBottom"} overflow="scroll" mt={4} ml={2}>
        <NftList />
      </GridItem>
    </Grid>
  );
}
