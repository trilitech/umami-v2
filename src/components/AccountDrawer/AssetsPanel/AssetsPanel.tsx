import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { Account, AccountType } from "../../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../../types/TokenBalance";
import { makeDelegation } from "../../../types/Delegation";
import { buildTzktAddressUrl } from "../../../utils/tzkt/helpers";
import { IconAndTextBtnLink } from "../../IconAndTextBtn";
import SmallTab from "../../SmallTab";
import { DelegationDisplay } from "./DelegationDisplay";
import MultisigPendingAccordion from "./MultisigPendingAccordion";
import { NFTsGrid } from "./NFTsGrid";
import { TokenList } from "./TokenList";
import { useAllDelegations } from "../../../utils/hooks/assetsHooks";
import {
  TzktCombinedOperation,
  getCombinedOperations,
  getTokenTransfers,
} from "../../../utils/tezos";
import { OperationListDisplay } from "../../../views/home/OperationListDisplay";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import { OperationTileContext } from "../../OperationTile";
import { useAppDispatch } from "../../../utils/redux/hooks";
import { assetsActions } from "../../../utils/redux/slices/assetsSlice";
import { TokenTransfer } from "../../../types/Transfer";

export const AssetsPanel: React.FC<{
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  account: Account;
}> = ({ tokens, nfts, account }) => {
  const isMultisig = account.type === AccountType.MULTISIG;
  const rawDelegations = useAllDelegations()[account.address.pkh];
  const delegation = rawDelegations ? makeDelegation(rawDelegations) : null;
  const network = useSelectedNetwork();
  const [operations, setOperations] = useState<TzktCombinedOperation[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getCombinedOperations([account.address.pkh], network).then(async operations => {
      setOperations(operations);

      const transactionIds = operations.map(op => op.id as number); // TODO: use zod
      const tokenTransfers = await getTokenTransfers(transactionIds, network);
      dispatch(assetsActions.updateTokenTransfers(tokenTransfers as TokenTransfer[]));
    });
  }, [account, network, setOperations, dispatch]);

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
          <OperationTileContext.Provider
            value={{ mode: "drawer", selectedAddress: account.address }}
          >
            <OperationListDisplay operations={operations} />
          </OperationTileContext.Provider>
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
          <NFTsGrid nftsByOwner={{ [account.address.pkh]: nfts }} columns={3} spacing={5} />
        </TabPanel>

        <TabPanel p="24px 0 60px 0" data-testid="account-card-tokens-tab">
          <TokenList tokens={tokens} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
