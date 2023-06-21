import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, UnorderedList } from "@chakra-ui/react";
import React from "react";
import { Account, AccountType } from "../../../types/Account";
import { FA12Token, FA2Token, NFT } from "../../../types/Asset";
import { OperationDisplay } from "../../../types/Operation";
import { OperationListDisplay } from "../../../views/home/OpertionList/OperationListDisplay";
import MultisigPendingList from "./MultisigPendingList";
import { NFTsGrid } from "./NFTsGrid";
import TokenTile from "./TokenTile";

export const AssetsPannel: React.FC<{
  tokens: Array<FA12Token | FA2Token>;
  nfts: Array<NFT>;
  account: Account;
  operationDisplays: OperationDisplay[];
}> = ({ tokens, nfts, account, operationDisplays }) => {
  const isMultisig = account.type === AccountType.MULTISIG;

  return (
    <Tabs
      height="100%"
      display="flex"
      flexDirection="column"
      mt={4}
      bg="umami.gray.900"
      borderRadius={4}
      w="500px"
      // color scheme not workkig even when put int 50-900 range
      // TODO Fix
      // https://chakra-ui.com/docs/components/tabs
    >
      <TabList>
        {isMultisig && <Tab data-testid="account-card-pending-tab"> Pendings</Tab>}
        <Tab>Tokens</Tab>
        <Tab>NFTs</Tab>
        <Tab>Operations</Tab>
        <Tab>Delegations</Tab>
      </TabList>
      <TabPanels height="100%">
        {isMultisig && (
          <TabPanel data-testid="account-card-pending-tab-panel">
            <MultisigPendingList account={account} />
          </TabPanel>
        )}
        <TabPanel data-testid="account-card-tokens-tab">
          <Box minHeight="10px" overflow="scroll" mt={4}>
            <UnorderedList>
              {tokens.map(t => {
                return <TokenTile token={t} key={t.contract + t.balance} />;
              })}
            </UnorderedList>
          </Box>
        </TabPanel>

        <TabPanel data-testid="account-card-nfts-tab" height="100%" overflow="hidden">
          <NFTsGrid nfts={nfts} showName={true} columns={3} spacing={5} />
        </TabPanel>

        <TabPanel data-testid="account-card-operations-tab">
          <OperationListDisplay operations={operationDisplays} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
