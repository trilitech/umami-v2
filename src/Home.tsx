import { Grid, GridItem } from "@chakra-ui/react";
import SideNavbar from "./components/SideNavbar";
import { TopBar } from "./components/TopBar";

import AccountListWithDrawer from "./views/home/AccountsList";

import { NftList } from "./views/home/NftList";
import { OperationsList } from "./views/home/OperationsList";

export default function Home() {
  return (
    <Grid
      templateAreas={`
                  "nav header header"
                  "nav main rightTop"
                  "nav main rightBottom"
                  `}
      gridTemplateRows={"0fr 1fr 1fr"}
      gridTemplateColumns={"0fr 1fr 1fr"}
      h="100vh"
      gap="1"
    >
      <GridItem area={"nav"}>
        <SideNavbar />
      </GridItem>
      <GridItem area={"header"}>
        <TopBar title="Overview" />
      </GridItem>
      <GridItem p={2} area={"main"}>
        <AccountListWithDrawer />
      </GridItem>
      <GridItem p={2} area={"rightTop"}>
        <OperationsList />
      </GridItem>
      <GridItem p={2} area={"rightBottom"} overflow={"scroll"}>
        <NftList />
      </GridItem>
    </Grid>
  );
}
