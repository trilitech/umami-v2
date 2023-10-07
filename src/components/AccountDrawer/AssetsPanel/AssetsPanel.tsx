import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { Account, AccountType } from "../../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../../types/TokenBalance";
import { makeDelegation } from "../../../types/Delegation";
import { OperationDisplay } from "../../../types/Transfer";
import { buildTzktAddressUrl } from "../../../utils/tzkt/helpers";
import { OperationListDisplay } from "../../../views/home/OpertionList/OperationListDisplay";
import { IconAndTextBtnLink } from "../../IconAndTextBtn";
import SmallTab from "../../SmallTab";
import { DelegationDisplay } from "./DelegationDisplay";
import MultisigPendingAccordion from "./MultisigPendingAccordion";
import { NFTsGrid } from "./NFTsGrid";
import { TokenList } from "./TokenList";
import { Network } from "../../../types/Network";
import { useAllDelegations } from "../../../utils/hooks/assetsHooks";

export const AssetsPanel: React.FC<{
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  account: Account;
  operationDisplays: OperationDisplay[];
  network: Network;
}> = ({ tokens, nfts, account, operationDisplays, network }) => {
  const isMultisig = account.type === AccountType.MULTISIG;
  const rawDelegations = useAllDelegations()[account.address.pkh];
  const delegation = rawDelegations ? makeDelegation(rawDelegations) : null;

  return (
    <Tabs
      height="100%"
      display="flex"
      flexDirection="column"
      mt={4}
      borderRadius={4}
      data-testid="asset-panel"
      w="100%"
    >
      <TabList justifyContent="space-between" data-testid="asset-panel-tablist">
        <Flex>
          {isMultisig && <SmallTab data-testid="account-card-pending-tab">Pending</SmallTab>}
          <SmallTab>Operations</SmallTab>
          <SmallTab>Delegation</SmallTab>
          <SmallTab>NFTs</SmallTab>
          <SmallTab>Tokens</SmallTab>
        </Flex>

        <IconAndTextBtnLink
          data-testid="tzkt-link"
          icon={FiExternalLink}
          label="View on Tzkt"
          href={buildTzktAddressUrl(network, account.address.pkh)}
          textFirst
        />
      </TabList>
      <TabPanels height="100%">
        {isMultisig && (
          <TabPanel p="24px 0 60px 0" data-testid="account-card-pending-tab-panel">
            <MultisigPendingAccordion account={account} />
          </TabPanel>
        )}

        <TabPanel p="24px 0 60px 0" data-testid="account-card-operations-tab">
          <OperationListDisplay operations={operationDisplays} />
        </TabPanel>

        <TabPanel p="24px 0 60px 0" data-testid="account-card-delegation-tab">
          <DelegationDisplay account={account} delegation={delegation} />
        </TabPanel>

        <TabPanel
          p="24px 0 60px 0"
          data-testid="account-card-nfts-tab"
          height="100%"
          overflow="hidden"
        >
          <NFTsGrid
            nftsByOwner={{ [account.address.pkh]: nfts }}
            showName={true}
            columns={3}
            spacing={5}
          />
        </TabPanel>

        <TabPanel p="24px 0 60px 0" data-testid="account-card-tokens-tab">
          <TokenList tokens={tokens} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
