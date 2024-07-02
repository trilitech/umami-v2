import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import {
  type Account,
  type FA12TokenBalance,
  type FA2TokenBalance,
  type ImplicitAccount,
  type NFTBalance,
} from "@umami/core";
import {
  useGetAccountUnstakeRequests,
  useGetPendingMultisigOperations,
  useSelectedNetwork,
} from "@umami/state";
import type React from "react";

import { EarnTab } from "./EarnTab";
import { MultisigPendingOperations } from "./MultisigPendingOperations";
import { NFTsGrid } from "./NFTsGrid";
import { OperationListDisplay } from "./OperationListDisplay";
import { PendingUnstakeRequests } from "./PendingUnstakeRequests";
import { TokenList } from "./TokenList";
import { ExternalLinkIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { useGetOperations } from "../../../views/operations/useGetOperations";
import { ExternalLink } from "../../ExternalLink";
import { OperationTileContext } from "../../OperationTile";
import { SmallTab } from "../../SmallTab";

/**
 * Component that displays account assets in the account drawer
 *
 * @param tokens - account tokens
 * @param nfts - account NFTs
 * @param account - selected account in the drawer
 * @param delegation - delegation info if exists
 */
export const AssetsPanel: React.FC<{
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  account: Account;
}> = ({ tokens, nfts, account }) => {
  const getPendingOperations = useGetPendingMultisigOperations();
  const hasPendingMultisigOperations =
    account.type === "multisig" && getPendingOperations(account).length > 0;
  const hasPendingUnstakeRequests = useGetAccountUnstakeRequests(account.address.pkh).length > 0;
  const showPendingTab = hasPendingMultisigOperations || hasPendingUnstakeRequests;

  const network = useSelectedNetwork();
  const { operations, isFirstLoad: isLoading } = useGetOperations([account]);

  return (
    <Tabs
      flexDirection="column"
      display="flex"
      width="100%"
      marginTop="60px"
      data-testid="asset-panel"
    >
      <TabList justifyContent="space-between" data-testid="asset-panel-tablist">
        <Flex>
          {showPendingTab && (
            <SmallTab data-testid="account-card-pending-tab">
              <Text>Pending</Text>
              <Box
                width="6px"
                height="6px"
                marginTop="-7px"
                marginRight="-3px"
                marginLeft="3px"
                borderRadius="100%"
                backgroundColor={colors.orangeL}
              />
            </SmallTab>
          )}
          <SmallTab data-testid="account-card-operations-tab">Operations</SmallTab>
          <SmallTab data-testid="account-card-nfts-tab">NFTs</SmallTab>
          <SmallTab data-testid="account-card-tokens-tab">Tokens</SmallTab>
          <SmallTab data-testid="account-card-earn-tab">Earn</SmallTab>
        </Flex>

        <ExternalLink href={`${network.tzktExplorerUrl}/${account.address.pkh}`}>
          <Button padding="0" variant="CTAWithIcon">
            <Text marginRight="7px" size="sm">
              View on Tzkt
            </Text>
            <ExternalLinkIcon stroke="inherit" />
          </Button>
        </ExternalLink>
      </TabList>
      <TabPanels height="100%">
        {showPendingTab && (
          <TabPanel
            overflowX="hidden"
            height="100%"
            paddingTop="24px"
            paddingBottom="60px"
            data-testid="account-card-pending-tab-panel"
            paddingX="0"
          >
            {hasPendingMultisigOperations && <MultisigPendingOperations account={account} />}
            {hasPendingUnstakeRequests && (
              <PendingUnstakeRequests account={account as ImplicitAccount} />
            )}
          </TabPanel>
        )}

        <TabPanel
          overflowX="hidden"
          height="100%"
          paddingTop="24px"
          paddingBottom="60px"
          data-testid="account-card-operations-tab-panel"
          paddingX="0"
        >
          <OperationTileContext.Provider
            value={{ mode: "drawer", selectedAddress: account.address }}
          >
            <Center display={isLoading ? "flex" : "none"} height="50px">
              <Image width="150px" height="75px" src="./static/media/loading-wheel.gif" />
            </Center>

            {!isLoading && (
              <OperationListDisplay operations={operations} owner={account.address.pkh} />
            )}
          </OperationTileContext.Provider>
        </TabPanel>

        <TabPanel
          overflowX="hidden"
          height="100%"
          paddingTop="24px"
          paddingBottom={0}
          data-testid="account-card-nfts-tab-panel"
          paddingX="0"
        >
          <NFTsGrid columns={3} nfts={nfts} owner={account.address.pkh} />
        </TabPanel>

        <TabPanel
          overflowX="hidden"
          height="100%"
          paddingTop="24px"
          data-testid="account-card-tokens-tab-panel"
          paddingX="0"
        >
          <TokenList owner={account.address.pkh} tokens={tokens} />
        </TabPanel>

        <TabPanel
          overflowX="hidden"
          paddingTop="24px"
          data-testid="account-card-earn-tab-panel"
          paddingX="0"
        >
          <EarnTab account={account} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
