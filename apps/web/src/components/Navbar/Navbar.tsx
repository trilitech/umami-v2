import { Card, Tab, TabList, Tabs } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export const Navbar = () => (
  <Card padding="10px" borderRadius="100px">
    <Tabs variant="solid-rounded">
      <TabList justifyContent="space-between">
        <Tab as={NavLink} flex="1" to="/activity">
          Activity
        </Tab>
        <Tab as={NavLink} flex="1" to="/nfts">
          NFTs
        </Tab>
        <Tab as={NavLink} flex="1" to="/tokens">
          Tokens
        </Tab>
        <Tab as={NavLink} flex="1" to="/earn">
          Earn
        </Tab>
      </TabList>
    </Tabs>
  </Card>
);
