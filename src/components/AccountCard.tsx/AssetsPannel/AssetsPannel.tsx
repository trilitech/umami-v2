import {
  Box,
  ListItem,
  Tab,
  TabList,
  Tabs,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import { FA12Token, FA2Token } from "../../../types/Asset";
import TokenTile from "./TokenTile";

export const AssetsPannel: React.FC<{
  tokens: Array<FA12Token | FA2Token>;
}> = ({ tokens }) => {
  return (
    <Tabs
      height={"100%"}
      display={"flex"}
      flexDirection="column"
      mt={4}
      bg="umami.gray.900"
      borderRadius={4}
      // color scheme not workkig even when put int 50-900 range
      // TODO Fix
      // https://chakra-ui.com/docs/components/tabs
    >
      <TabList>
        <Tab>Tokens</Tab>
        <Tab>NFTs</Tab>
        <Tab>Operations</Tab>
        <Tab>Delegations</Tab>
      </TabList>

      <Box minHeight={"10px"} overflow={"scroll"} mt={4}>
        <UnorderedList>
          {tokens.map((t) => {
            return <TokenTile token={t} />;
          })}
        </UnorderedList>
      </Box>
    </Tabs>
  );
};
