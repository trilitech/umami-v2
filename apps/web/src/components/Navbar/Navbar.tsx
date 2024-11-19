import { Card, TabList, Tabs } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";
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

export const Navbar = () => {
  const color = useColor();

  return (
    <Card
      zIndex={1}
      padding={{ base: "6px 12px", md: "10px" }}
      background={color("rgba(255, 255, 255, 0.90)", "rgba(34, 34, 63, 0.90)")}
      borderRadius={{ base: 0, md: "100px" }}
      boxShadow={{
        base: "-2px -4px 10px 0px rgba(45, 55, 72, 0.06)",
        md: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
      }}
      backdropFilter="blur(5px)"
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
};
