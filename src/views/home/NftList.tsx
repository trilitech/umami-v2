import { TabList, Tabs } from "@chakra-ui/react";
import { compact } from "lodash";
import { NFTsGrid } from "../../components/AccountCard/AssetsPannel/NFTsGrid";
import NestedScroll from "../../components/NestedScroll";
import SmallTab from "../../components/SmallTab";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
export const NftList = () => {
  const nfts = useAllNfts();

  const allOwnedNFTs = compact(Object.values(nfts).flat());

  return (
    <Tabs height="100%" display="flex" flexDirection="column" bg="umami.gray.900" borderRadius={4}>
      <TabList>
        <SmallTab>All NFTs</SmallTab>
      </TabList>

      <NestedScroll>
        <NFTsGrid nfts={allOwnedNFTs} columns={4} spacing={4} />
      </NestedScroll>
    </Tabs>
  );
};
