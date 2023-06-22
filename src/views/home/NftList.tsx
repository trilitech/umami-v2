import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { NFTsGrid } from "../../components/AccountCard/AssetsPannel/NFTsGrid";
import NestedScroll from "../../components/NestedScroll";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
export const NftList = () => {
  const nfts = useAllNfts();

  const allOwnedNFTs = Object.values(nfts).flat();

  return (
    <Tabs height="100%" display="flex" flexDirection="column" bg="umami.gray.900" borderRadius={4}>
      <TabList>
        <Tab>All NFTs</Tab>
      </TabList>

      <NestedScroll>
        <NFTsGrid nfts={allOwnedNFTs} columns={4} spacing={4} />
      </NestedScroll>
    </Tabs>
  );
};
