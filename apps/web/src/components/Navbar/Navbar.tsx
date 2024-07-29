import { Card, TabList, Tabs } from "@chakra-ui/react";

import { Tab } from "../Tab";

const tabs = [
  {
    label: "Tokens",
    to: "/tokens",
  },
  {
    label: "NFTs",
    to: "/nfts",
  },
  {
    label: "Earn",
    to: "/earn",
  },
  {
    label: "Activity",
    to: "/activity",
  },
];

export const Navbar = () => (
  <Card
    zIndex={1}
    padding={{ base: "6px 12px", lg: "10px" }}
    opacity={0.95}
    borderRadius={{ base: 0, lg: "100px" }}
    boxShadow={{
      base: "-2px -4px 10px 0px rgba(45, 55, 72, 0.06)",
      lg: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
    }}
  >
    <Tabs defaultIndex={-1} isFitted variant="solid-rounded">
      <TabList gap="1px">
        {tabs.map(tab => (
          <Tab key={tab.to} label={tab.label} to={tab.to} />
        ))}
      </TabList>
    </Tabs>
  </Card>
);
