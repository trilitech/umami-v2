import { Card, Tab, TabList, Tabs } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export const Navbar = () => (
  <Card
    padding={{ base: "6px 12px", lg: "10px" }}
    borderRadius={{ base: 0, lg: "100px" }}
    boxShadow={{
      base: "-2px -4px 10px 0px rgba(45, 55, 72, 0.06)",
      lg: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
    }}
  >
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
