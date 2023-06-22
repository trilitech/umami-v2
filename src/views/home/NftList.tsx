import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { NFTsGrid } from "../../components/AccountCard/AssetsPannel/NFTsGrid";
import NestedScroll from "../../components/NestedScroll";
import { NoNFTS } from "../../components/NoItems/NoItems";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
export const NftList = () => {
  const nfts = useAllNfts();

  const allOwnedNfts = Object.values(nfts).flat();

  return (
    <Tabs height="100%" display="flex" flexDirection="column" bg="umami.gray.900" borderRadius={4}>
      <TabList>
        <Tab>All NFTs</Tab>
      </TabList>

      {allOwnedNfts.length === 0 ? (
        <NoNFTS small />
      ) : (
        <NestedScroll>
          <NFTsGrid nfts={allOwnedNfts} columns={4} spacing={4} />
        </NestedScroll>
      )}
    </Tabs>
  );
};
