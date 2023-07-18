import { TezosNetwork } from "@airgap/tezos";
import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { Account, AccountType } from "../../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../../types/TokenBalance";
import { Delegation } from "../../../types/Delegation";
import { OperationDisplay } from "../../../types/Transfer";
import { buildTzktAddressUrl } from "../../../utils/tzkt/helpers";
import { OperationListDisplay } from "../../../views/home/OpertionList/OperationListDisplay";
import { IconAndTextBtnLink } from "../../IconAndTextBtn";
import { DelegationMode } from "../../sendForm/types";
import SmallTab from "../../SmallTab";
import { DelegationDisplay } from "./DelegationDisplay";
import MultisigPendingAccordion from "./MultisigPendingAccordion";
import { NFTsGrid } from "./NFTsGrid";
import { TokenList } from "./TokenList";

export const AssetsPanel: React.FC<{
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  account: Account;
  operationDisplays: OperationDisplay[];
  network: TezosNetwork;
  delegation: Delegation | null;
  onDelegate: (opts?: DelegationMode["data"]) => void;
}> = ({ tokens, nfts, account, operationDisplays, network, delegation, onDelegate }) => {
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
          <SmallTab>Delegation</SmallTab>
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
            <MultisigPendingAccordion account={account} />
          </TabPanel>
        )}
        <TabPanel data-testid="account-card-tokens-tab">
          <TokenList tokens={tokens} />
        </TabPanel>

        <TabPanel data-testid="account-card-nfts-tab" height="100%" overflow="hidden">
          <NFTsGrid
            nftsByOwner={{ [account.address.pkh]: nfts }}
            showName={true}
            columns={3}
            spacing={5}
          />
        </TabPanel>

        <TabPanel data-testid="account-card-operations-tab">
          <OperationListDisplay operations={operationDisplays} />
        </TabPanel>
        <TabPanel data-testid="account-card-delegation-tab">
          <DelegationDisplay delegation={delegation} onDelegate={onDelegate} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
