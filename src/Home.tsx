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
      <GridItem p={2} area={"main"}>
        <AccountListWithDrawer />
      </GridItem>
      <GridItem p={2} area={"rightTop"}>
        <OperationsList />
      </GridItem>
      <GridItem p={2} area={"rightBottom"} overflow="scroll">
        <NftList />
      </GridItem>
    </Grid>
  );
}
