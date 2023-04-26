import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import { FA12Token, FA2Token, NFT } from "../../../types/Asset";
import { NFTsGrid } from "./NFTsGrid";
import TokenTile from "./TokenTile";

export const AssetsPannel: React.FC<{
  tokens: Array<FA12Token | FA2Token>;
  nfts: Array<NFT>;
}> = ({ tokens, nfts }) => {
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
      <TabPanels>
        <TabPanel data-testid="account-card-tokens-tab">
          <Box minHeight={"10px"} overflow={"scroll"} mt={4}>
            <UnorderedList>
              {tokens.map((t) => {
                return <TokenTile token={t} key={t.contract + t.balance} />;
              })}
            </UnorderedList>
          </Box>
        </TabPanel>

        <TabPanel data-testid="account-card-nfts-tab">
          <NFTsGrid nfts={nfts} showName={true} columns={3} spacing={5} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
