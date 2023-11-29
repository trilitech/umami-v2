import { Button, Flex, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { Account } from "../../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../../types/TokenBalance";
import { Delegation } from "../../../types/Delegation";
import { buildTzktAddressUrl } from "../../../utils/tzkt/helpers";
import SmallTab from "../../SmallTab";
import { DelegationDisplay } from "./DelegationDisplay";
import MultisigPendingAccordion from "./MultisigPendingAccordion";
import { NFTsGrid } from "./NFTsGrid";
import { TokenList } from "./TokenList";

import { OperationListDisplay } from "../../../views/home/OperationListDisplay";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import { OperationTileContext } from "../../OperationTile";
import { useGetOperations } from "../../../views/operations/useGetOperations";
import colors from "../../../style/colors";
import { ExternalLink } from "../../ExternalLink";
import ExternalLinkIcon from "../../../assets/icons/ExternalLink";

export const AssetsPanel: React.FC<{
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  account: Account;
  delegation: Delegation | null;
}> = ({ tokens, nfts, account, delegation }) => {
  const isMultisig = account.type === "multisig";
  const network = useSelectedNetwork();
  const { operations, isFirstLoad: areOperationsLoading } = useGetOperations([account.address.pkh]);

  return (
    <Tabs
      flexDirection="column"
      display="flex"
      width="100%"
      height="100%"
      marginTop="60px"
      data-testid="asset-panel"
    >
      <TabList justifyContent="space-between" data-testid="asset-panel-tablist">
        <Flex>
          {isMultisig && <SmallTab data-testid="account-card-pending-tab">Pending</SmallTab>}
          <SmallTab>Operations</SmallTab>
          <SmallTab>Delegation</SmallTab>
          <SmallTab>NFTs</SmallTab>
          <SmallTab>Tokens</SmallTab>
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
      <TabPanels height="100%">
        {isMultisig && (
          <TabPanel padding="24px 0 60px 0" data-testid="account-card-pending-tab-panel">
            <MultisigPendingAccordion account={account} />
          </TabPanel>
        )}

        <TabPanel padding="24px 0 60px 0" data-testid="account-card-operations-tab">
          <OperationTileContext.Provider
            value={{ mode: "drawer", selectedAddress: account.address }}
          >
            {areOperationsLoading ? (
              <Text color={colors.gray[500]} textAlign="center">
                Loading...
              </Text>
            ) : (
              <OperationListDisplay operations={operations} />
            )}
          </OperationTileContext.Provider>
        </TabPanel>

        <TabPanel padding="24px 0 60px 0" data-testid="account-card-delegation-tab">
          <DelegationDisplay account={account} delegation={delegation} />
        </TabPanel>

        <TabPanel
          overflow="hidden"
          height="100%"
          padding="24px 0 60px 0"
          data-testid="account-card-nfts-tab"
        >
          <NFTsGrid columns={3} nftsByOwner={{ [account.address.pkh]: nfts }} spacing={5} />
        </TabPanel>

        <TabPanel padding="24px 0 60px 0" data-testid="account-card-tokens-tab">
          <TokenList tokens={tokens} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
