import { TezosNetwork } from "@airgap/tezos";
import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { Account, AccountType } from "../../../types/Account";
import { FA12Token, FA2Token, NFT } from "../../../types/Asset";
import { OperationDisplay } from "../../../types/Operation";
import { buildTzktAddressUrl } from "../../../utils/tzkt/helpers";
import { OperationListDisplay } from "../../../views/home/OpertionList/OperationListDisplay";
import { IconAndTextBtnLink } from "../../IconAndTextBtn";
import SmallTab from "../../SmallTab";
import MultisigPendingList from "./MultisigPendingList";
import { NFTsGrid } from "./NFTsGrid";
import { TokenList } from "./TokenList";

export const AssetsPanel: React.FC<{
  tokens: Array<FA12Token | FA2Token>;
  nfts: Array<NFT>;
  account: Account;
  operationDisplays: OperationDisplay[];
  network: TezosNetwork;
}> = ({ tokens, nfts, account, operationDisplays, network }) => {
  const isMultisig = account.type === AccountType.MULTISIG;

  return (
    <Tabs
      height="100%"
      display="flex"
      flexDirection="column"
      mt={4}
      bg="umami.gray.900"
      borderRadius={4}
      data-testid="asset-panel"
      w="100%"
      // color scheme not workkig even when put int 50-900 range
      // TODO Fix
      // https://chakra-ui.com/docs/components/tabs
    >
      <TabList justifyContent="space-between" data-testid="asset-panel-tablist">
        <Flex>
          {isMultisig && <SmallTab data-testid="account-card-pending-tab"> Pending</SmallTab>}
          <SmallTab>Tokens</SmallTab>
          <SmallTab>NFTs</SmallTab>
          <SmallTab>Operations</SmallTab>
          <SmallTab>Delegations</SmallTab>
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
          <TabPanel data-testid="account-card-pending-tab-panel">
            <MultisigPendingList account={account} />
          </TabPanel>
        )}
        <TabPanel data-testid="account-card-tokens-tab">
          <TokenList tokens={tokens} />
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
