import { Box, Button, Flex, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";

import { DelegationDisplay } from "./DelegationDisplay";
import { MultisigPendingOperations } from "./MultisigPendingOperations";
import { NFTsGrid } from "./NFTsGrid";
import { OperationListDisplay } from "./OperationListDisplay";
import { TokenList } from "./TokenList";
import { ExternalLinkIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { Account } from "../../../types/Account";
import { Delegation } from "../../../types/Delegation";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../../types/TokenBalance";
import { useGetPendingMultisigOperations } from "../../../utils/hooks/multisigHooks";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import { buildTzktAddressUrl } from "../../../utils/tzkt/helpers";
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
  delegation: Delegation | null;
}> = ({ tokens, nfts, account, delegation }) => {
  const getPendingOperations = useGetPendingMultisigOperations();
  const withPendingOperations =
    account.type === "multisig" && getPendingOperations(account).length > 0;

  const network = useSelectedNetwork();
  const { operations, isFirstLoad: areOperationsLoading } = useGetOperations([account.address.pkh]);

  return (
    <Tabs
      flexDirection="column"
      display="flex"
      overflow="hidden"
      width="100%"
      marginTop="60px"
      data-testid="asset-panel"
    >
      <TabList justifyContent="space-between" data-testid="asset-panel-tablist">
        <Flex>
          {withPendingOperations && (
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
          <SmallTab data-testid="account-card-delegation-tab">Delegation</SmallTab>
          <SmallTab data-testid="account-card-nfts-tab">NFTs</SmallTab>
          <SmallTab data-testid="account-card-tokens-tab">Tokens</SmallTab>
        </Flex>

        <ExternalLink href={buildTzktAddressUrl(network, account.address.pkh)}>
          <Button paddingRight={0} variant="CTAWithIcon">
            <Text marginRight="7px" size="sm">
              View on Tzkt
            </Text>
            <ExternalLinkIcon stroke="currentcolor" />
          </Button>
        </ExternalLink>
      </TabList>
      <TabPanels height="100%" paddingBottom="60px">
        {withPendingOperations && (
          <TabPanel
            overflowX="hidden"
            height="100%"
            paddingTop="24px"
            paddingBottom="60px"
            data-testid="account-card-pending-tab-panel"
            paddingX="0"
          >
            <MultisigPendingOperations account={account} />
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
            {areOperationsLoading ? (
              <Text color={colors.gray[500]} textAlign="center">
                Loading...
              </Text>
            ) : (
              <OperationListDisplay operations={operations} owner={account.address.pkh} />
            )}
          </OperationTileContext.Provider>
        </TabPanel>

        <TabPanel
          overflowX="hidden"
          paddingTop="24px"
          data-testid="account-card-delegation-tab-panel"
          paddingX="0"
        >
          <DelegationDisplay account={account} delegation={delegation} />
        </TabPanel>

        <TabPanel
          overflowX="hidden"
          height="100%"
          paddingTop="24px"
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
      </TabPanels>
    </Tabs>
  );
};
