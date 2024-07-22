import { Card, TabList, Tabs } from "@chakra-ui/react";

import { Tab } from "../Tab";

const tabs = [
  {
    label: "Activity",
    to: "/activity",
  },
  {
    label: "NFTs",
    to: "/nfts",
  },
  {
    label: "Tokens",
    to: "/tokens",
  },
  {
    label: "Earn",
    to: "/earn",
  },
];

export const Navbar = () => (
  <Card
    padding={{ base: "6px 12px", lg: "10px" }}
    borderRadius={{ base: 0, lg: "100px" }}
    boxShadow={{
      base: "-2px -4px 10px 0px rgba(45, 55, 72, 0.06)",
      lg: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
    }}
  >
    <Tabs defaultIndex={-1} isFitted variant="solid-rounded">
      <TabList justifyContent="space-between">
        {tabs.map(tab => (
          <AnimatePresence key={tab.to}>
            <Tab label={tab.label} to={tab.to} />
          </AnimatePresence>
        ))}
      </TabList>
    </Tabs>
  </Card>
);
